from .models import Action, FlowTemplate, State, Transition


class ProcessService:

    @classmethod
    def create_flow_data(cls, process_obj, user):
        """创建流程相关状态和流转数据

        提交合同之后, 需要根据流程模板创建相关流程数据
        """
        # 创建状态State
        start_state_data = {
            'process': process_obj,
            'name': '开始',
            'state_type_id': 'start',
            'active': True
        }
        start_state_obj = State.objects.create(**start_state_data)
        start_state_obj.operators.add(process_obj.creator)
        # TODO(yangle) 现在只支持一个公司一个模板
        flow_template_obj = FlowTemplate.objects.filter(company=user.company).last()
        flow_template_steps = flow_template_obj.steps.all()
        normal_states = []
        for step in flow_template_steps:
            state_data = {
                'process': process_obj,
                'name': step.step_name,
                'state_type_id': 'normal',
                'work_mode': step.work_mode
            }
            state = State.objects.create(**state_data)
            state.operators.set(step.operators.all())
            normal_states.append(state)
        complete_state_data = {
            'process': process_obj,
            'name': '完成',
            'state_type_id': 'complete'
        }
        complete_state_obj = State.objects.create(**complete_state_data)
        cancel_state_data = {
            'process': process_obj,
            'name': '完成',
            'state_type_id': 'cancelled'
        }
        cancel_state_obj = State.objects.create(**cancel_state_data)
        # 创建transition
        transition_data = {
            'process': process_obj,
            'current_state': start_state_obj,
            'next_state': normal_states[0],
            'action_type_id': 'approve'
        }
        Transition.objects.create(**transition_data)
        transition_data = {
            'process': process_obj,
            'current_state': start_state_obj,
            'next_state': cancel_state_obj,
            'action_type_id': 'cancel'
        }
        Transition.objects.create(**transition_data)
        for i, normal_state in enumerate(normal_states):
            if i + 1 < len(normal_states):
                next_state = normal_states[i+1]
            else:
                next_state = complete_state_obj
            transition_data = {
                'process': process_obj,
                'current_state': normal_state,
                'next_state': next_state,
                'action_type_id': 'approve'
            }
            Transition.objects.create(**transition_data)
            transition_data = {
                'process': process_obj,
                'current_state': normal_state,
                'next_state': start_state_obj,
                'action_type_id': 'restart'
            }
            Transition.objects.create(**transition_data)
        return True

    @classmethod
    def process_transition(cls, process_obj, user, action_type, description=''):
        """工作流程状态流转

        根据审核来更新process的状态
        """
        current_state = process_obj.current_state()
        transition_obj = process_obj.transition_set.get(current_state=current_state, action_type_id=action_type)
        action_data = {
            'process': process_obj,
            'action_type_id': action_type,
            'transition': transition_obj,
            'operator': user,
            'description': description
        }
        Action.objects.create(**action_data)
        next_state = transition_obj.next_state
        if current_state.work_mode == 'or':
            cls.process_transit_state(process_obj, next_state)
        elif current_state.work_mode == 'and':
            if action_type == 'approve':
                operators = current_state.operators.all()
                other_all_approve = True
                for operator in operators:
                    action = Action.objects.filter(operator=operator).order_by('-created_time').first()
                    if not (action and action.action_type_id == 'approve'):
                        other_all_approve = False
                        break
                if other_all_approve:
                    cls.process_transit_state(process_obj, next_state)
            elif action_type == 'restart':
                cls.process_transit_state(process_obj, next_state)
        return True

    @classmethod
    def process_transit_state(cls, process_obj, to_state):
        """更改process到指定state
        """
        assert to_state in process_obj.state_set.all(), '工作流程{}不包含{}状态'.format(
            process_obj.title, to_state.name)
        current_state = process_obj.state_set.get(active=True)
        current_state.active = False
        current_state.save()
        to_state.active = True
        to_state.save()
        return True
