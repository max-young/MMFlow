from rest_framework import serializers

from organization.serializers import UserSerializer

from .models import FlowTemplate, FlowTemplateStep, Process, Contract, Action
from organization.models import User


class FlowTemplateStepSerializer(serializers.ModelSerializer):
    """模板步骤Serializer
    """
    flow_template = serializers.PrimaryKeyRelatedField(queryset=FlowTemplate.objects.all(), required=False)
    operators = UserSerializer(many=True, read_only=True)
    operator_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = FlowTemplateStep
        fields = '__all__'

    def create(self, validated_data):
        operator_ids = validated_data.pop('operator_ids')
        instance = FlowTemplateStep(**validated_data)
        instance.save()
        new_operators = [User.objects.get(id=i) for i in operator_ids]
        instance.operators.set(new_operators)
        return instance

    def update(self, instance, validated_data):
        operator_ids = validated_data.pop('operator_ids')
        new_operators = [User.objects.get(id=i) for i in operator_ids]
        instance.operators.set(new_operators)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class FlowTemplateSerializer(serializers.ModelSerializer):
    """模板Serializer
    """
    steps = FlowTemplateStepSerializer(many=True)
    requesters = UserSerializer(many=True, read_only=True)
    requester_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = FlowTemplate
        exclude = ('company',)

    def validate_company(self, data):
        user = self.context.get('request').user
        if user.company != data:
            raise serializers.ValidationError('公司信息不正确')
        return data

    def create(self, validated_data):
        requester_ids = validated_data.pop('requester_ids')
        steps_data = validated_data.pop('steps')
        # 创建template
        user = self.context.get('request').user
        validated_data['company'] = user.company
        instance = FlowTemplate(**validated_data)
        instance.save()
        # 创建requester
        new_requesters = [User.objects.get(id=i) for i in requester_ids]
        instance.requesters.set(new_requesters)
        # 创建step
        step_no = 1
        for data in steps_data:
            data.update({
                'no': step_no,
                'flow_template': instance.id
            })
            step_serializer = FlowTemplateStepSerializer(data=data)
            step_serializer.is_valid(raise_exception=True)
            step_serializer.save()
            step_no += 1
        return instance

    def update(self, instance, validated_data):
        requester_ids = validated_data.pop('requester_ids')
        steps_data = validated_data.pop('steps')
        # 更新requester
        new_requesters = [User.objects.get(id=i) for i in requester_ids]
        instance.requesters.set(new_requesters)
        # 更新step
        step_no = 1
        new_steps = []
        for data in steps_data:
            data.update({
                'no': step_no,
                'flow_template': instance.id
            })
            origin_step = instance.steps.filter(no=step_no).first()
            if origin_step:
                step_serializer = FlowTemplateStepSerializer(origin_step, data)
            else:
                step_serializer = FlowTemplateStepSerializer(data=data)
            step_serializer.is_valid(raise_exception=True)
            new_step = step_serializer.save()
            new_steps.append(new_step)
            step_no += 1
        instance.steps.filter(no__gte=step_no).delete()
        # 更新template
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class ContractSerializer(serializers.ModelSerializer):
    """合同信息
    """

    class Meta:
        model = Contract
        fields = ('contract_name', 'party_a_name', 'party_b_name', 'contract_content')


class ProcessSerializer(serializers.ModelSerializer):
    """业务流程
    """
    contract = ContractSerializer(help_text='合同信息')
    status = serializers.SerializerMethodField()
    current_state = serializers.SerializerMethodField()
    creator_name = serializers.SerializerMethodField()

    class Meta:
        """
        公司和创建人在创建时写入即可, 不需要更新
        公司也不需要展示
        """
        model = Process
        exclude = ('company',)
        read_only_fields = ('creator',)

    def get_status(self, obj):
        state_obj = obj.state_set.get(active=True)
        return state_obj.state_type.name

    def get_current_state(self, obj):
        return obj.current_state().name

    def get_creator_name(self, obj):
        return obj.creator.first_name

    def create(self, validated_data):
        contract_data = validated_data.pop('contract')
        creator = self.context.get('request').user
        validated_data['company'] = creator.company
        validated_data['creator'] = creator
        process = Process.objects.create(**validated_data)
        contract_data['process'] = process
        Contract.objects.create(**contract_data)
        return process

    def update(self, instance, validated_data):
        contract_data = validated_data.pop('contract')
        contract = instance.contract
        instance.title = validated_data.get('title')
        instance.updator = validated_data.get('updator')
        instance.save()
        contract.contract_name = contract_data.get('contract_name')
        contract.party_a_name = contract_data.get('party_a_name')
        contract.party_b_name = contract_data.get('party_b_name')
        contract.contract_content = contract_data.get('contract_content')
        contract.save()
        return instance


class ActionSerializer(serializers.ModelSerializer):
    """操作记录
    """
    operator_name = serializers.SerializerMethodField()

    class Meta:
        model = Action
        fields = '__all__'

    def get_operator_name(self, obj):
        return obj.operator.username
