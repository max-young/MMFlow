from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import FlowTemplate, Process, State
from .serializers import (ActionSerializer, FlowTemplateSerializer,
                          ProcessSerializer)
from .services import ProcessService


class FlowTemplateView(viewsets.ModelViewSet):
    """工作流程模板

    retrieve:
    Response
    ```json
    {
        "id": 1,
        "steps": [
            {
                "id": 1,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 2,
                        "username": "tony",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 3,
                        "username": "max",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "主管",
                "work_mode": "or",
                "no": 1
            },
            {
                "id": 2,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 4,
                        "username": "will",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 5,
                        "username": "james",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "总监",
                "work_mode": "or",
                "no": 2
            }
        ],
        "requesters": [
            {
                "id": 1,
                "username": "yangle",
                "first_name": "",
                "email": ""
            },
            {
                "id": 2,
                "username": "tony",
                "first_name": "",
                "email": ""
            }
        ],
        "flow_template_name": "出差审批"
    }
    ```

    create:
    Parameters
    ```json
    {
        "steps": [
            {
                "operator_ids": [2,3],
                "step_name": "主管",
                "work_mode": "or",
                "no": 1
            },
            {
                "operator_ids": [4,5],
                "step_name": "总监",
                "work_mode": "or",
                "no": 2
            }
        ],
        "requester_ids": [1,2],
        "flow_template_name": "出差审批"
    }
    ```
    Response
    ```json
    {
        "id": 1,
        "steps": [
            {
                "id": 1,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 2,
                        "username": "tony",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 3,
                        "username": "max",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "主管",
                "work_mode": "or",
                "no": 1
            },
            {
                "id": 2,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 4,
                        "username": "will",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 5,
                        "username": "james",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "总监",
                "work_mode": "or",
                "no": 2
            }
        ],
        "requesters": [
            {
                "id": 1,
                "username": "yangle",
                "first_name": "",
                "email": ""
            },
            {
                "id": 2,
                "username": "tony",
                "first_name": "",
                "email": ""
            }
        ],
        "flow_template_name": "出差审批"
    }
    ```

    update:
    Parameters
    ```json
    {
        "steps": [
            {
                "operator_ids": [2,3],
                "step_name": "主管",
                "work_mode": "or",
                "no": 1
            },
            {
                "operator_ids": [4,5],
                "step_name": "总监",
                "work_mode": "or",
                "no": 2
            }
        ],
        "requester_ids": [1,2],
        "flow_template_name": "出差审批"
    }
    ```
    Response
    ```json
    {
        "id": 1,
        "steps": [
            {
                "id": 1,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 2,
                        "username": "tony",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 3,
                        "username": "max",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "主管",
                "work_mode": "or",
                "no": 1
            },
            {
                "id": 2,
                "flow_template": 1,
                "operators": [
                    {
                        "id": 4,
                        "username": "will",
                        "first_name": "",
                        "email": ""
                    },
                    {
                        "id": 5,
                        "username": "james",
                        "first_name": "",
                        "email": ""
                    }
                ],
                "step_name": "总监",
                "work_mode": "or",
                "no": 2
            }
        ],
        "requesters": [
            {
                "id": 1,
                "username": "yangle",
                "first_name": "",
                "email": ""
            },
            {
                "id": 2,
                "username": "tony",
                "first_name": "",
                "email": ""
            }
        ],
        "flow_template_name": "出差审批"
    }
    ```
    """
    serializer_class = FlowTemplateSerializer
    queryset = FlowTemplate.objects.all()


class ProcessView(viewsets.ModelViewSet):
    """流程
    """
    serializer_class = ProcessSerializer
    queryset = Process.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Process.objects.filter(company=user.company)
        else:
            return Process.objects.filter(state__operators=user)

    @action(detail=True, methods=['get'])
    def actions(self, request, pk=None):
        """操作记录
        """
        process_obj = self.get_object()
        actions = process_obj.action_set.all()
        serializer = ActionSerializer(actions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request):
        """提交创建流程

        Parameter
        ```json
        {
            "contract_name": "111111",  // 合同名称
            "party_a_name": "222",  // 甲方
            "party_b_name": "333",  // 乙方
            "save_mode": "submit",  // 保存还是提交, 保存save, 提交submit
            "contract_content": ""  // 合同内容
        }
        ```
        Response
        ```json
        {
            "id": 4,
            "contract": {
                "contract_name": "111111",
                "party_a_name": "222",
                "party_b_name": "333",
                "contract_content": ""
            },
            "status": "start",
            "title": "111111",
            "created_time": "2018-12-14T07:43:42.530269Z",
            "updated_time": "2018-12-14T07:43:42.530310Z",
            "company": 1,
            "creator": 1,
            "creator_name": "will",
            "updator": null
        }
        ```
        """
        # 创建流程合同主数据
        user = request.user
        # TODO(yangle) 一个公司限制只能有一个模板
        flow_template = FlowTemplate.objects.filter(company=user.company).last()
        if user not in flow_template.requesters.all():
            return Response({'message': '您没有权限创建'}, status=status.HTTP_403_FORBIDDEN)
        # TODO(yangle) process的title暂时和contract的name同名, 预留字段供以后扩展
        data = {
            'company': user.company.id,
            'title': request.data.get('contract_name'),
            'creator': user.id,
            'contract': {
                'contract_name': request.data.get('contract_name'),
                'party_a_name': request.data.get('party_a_name'),
                'party_b_name': request.data.get('party_b_name'),
                'contract_content': request.data.get('contract_content')
            }
        }
        process_serializer = ProcessSerializer(data=data, context={'request': request})
        process_serializer.is_valid(raise_exception=True)
        new_process = process_serializer.save()
        # 创建流程相关状态数据, 如果是提交则流转到下一步
        ProcessService.create_flow_data(new_process, request.user)
        save_mode = request.data.get('save_mode')
        if save_mode == 'submit':
            ProcessService.process_transition(new_process, user, 'approve')
        return Response(process_serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, pk=None):
        """编辑工作流程
        """
        process_obj = self.get_object()
        current_state = process_obj.current_state()
        current_state_type = current_state.state_type_id
        assert current_state_type not in ('complete', 'cancelled'), '当前工作流程不能编辑'
        user = request.user
        if user not in current_state.operators.all():
            return Response({'message': '您没有权限编辑'}, status=status.HTTP_403_FORBIDDEN)
        # 整理数据
        # TODO(yangle) process的title暂时和contract的name同名, 预留字段供以后扩展
        data = {
            'title': request.data.get('contract_name'),
            'updator': user.id,
            'contract': {
                'contract_name': request.data.get('contract_name'),
                'party_a_name': request.data.get('party_a_name'),
                'party_b_name': request.data.get('party_b_name'),
                'contract_content': request.data.get('contract_content')
            }
        }
        process_serializer = ProcessSerializer(process_obj, data=data)
        process_serializer.is_valid(raise_exception=True)
        updated_process_obj = process_serializer.save()
        # 如果是在开始阶段并提交, 则提交到下一流程
        if current_state_type == 'start':
            save_mode = request.data.get('save_mode')
            if save_mode == 'submit':
                    ProcessService.process_transition(updated_process_obj, user, 'approve')
        return Response(process_serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    @action(detail=True, methods=['post'])
    def operate(self, request, pk=None):
        """审核

        Parameters
        ```json
        {
            "operate_type": "approve",
            "description": "queren"
        }
        ```
        Response
        ```json
        status 200
        {
            "message": "审核成功"
        }
        ```
        """
        process_obj = self.get_object()
        current_state = process_obj.current_state()
        user = request.user
        if user not in current_state.operators.all():
            return Response({'message': '您没有权限审核'}, status=status.HTTP_403_FORBIDDEN)
        assert process_obj.state_type() == 'normal', '工作流程{}不在流转状态中'.format(process_obj.title)
        ProcessService.process_transition(process_obj, request.user, request.data.get('operate_type'),
                                          request.data.get('description'))
        return Response({'message': '审核成功'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """用户首页统计

        Response
        ```json
        {
            // 待处理合同流程
            "for_operate_processes_data": [
                {
                    "id": 9,
                    "contract": {
                        "contract_name": "nnn",
                        "party_a_name": "nnn",
                        "party_b_name": "nnn",
                        "contract_content": ""
                    },
                    "status": "normal",
                    "current_state": "总监",
                    "creator_name": "max.young.m",
                    "title": "nnn",
                    "created_time": "2018-12-17T02:55:33.127101Z",
                    "updated_time": "2018-12-17T06:02:40.908279Z",
                    "creator": 1,
                    "updator": 1
                }
            ],
            // 待处理合同流程按状态数量统计
            "state_statistics": {
                "总监": 6,
                "主管": 1
            }
        }
        ```
        """
        user = request.user
        for_operate_states = State.objects.filter(
            operators=user, active=True, state_type__name__in=('start', 'normal')).values(
                'process', 'name').all()

        process_ids = [i.get('process') for i in for_operate_states]
        for_operate_processes = Process.objects.filter(id__in=process_ids).all()
        process_serializer = ProcessSerializer(for_operate_processes, many=True)

        import collections
        state_statistics = dict(collections.Counter(i['name'] for i in for_operate_states))

        result = {
            'for_operate_processes_data': process_serializer.data,
            'state_statistics': state_statistics
        }
        return Response(result, status=status.HTTP_200_OK)
