"""
工作流相关数据库模型设计
"""

from django.conf import settings
from django.db import models

# 工作流程步骤里的审核模式
WORK_MODE_CHOICES = (
    ('or', 'or'),
    ('and', 'and')
)


class FlowTemplate(models.Model):
    """工作流模板

    Attributes:
        requester: 允许的业务发起者
    """
    company = models.ForeignKey('organization.Company', on_delete=models.PROTECT, verbose_name='模板隶属公司')
    flow_template_name = models.CharField('模板名称', max_length=20)
    requesters = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name='可发起工作流的职员')

    class Meta:
        verbose_name = '工作流模板'
        verbose_name_plural = '工作流模板'

    def __str__(self):
        return self.flow_template_name


class FlowTemplateStep(models.Model):
    """工作流模板的步骤数据

    Attributes:
        operators: 此流程的操作者
        or_or_and: 多个审核者, 通过到下一个流程的规则是一个审核者通过, 还是所有审核者通过
    """
    flow_template = models.ForeignKey(FlowTemplate, related_name='steps', on_delete=models.CASCADE, verbose_name='隶属模板')
    step_name = models.CharField('步骤名称', max_length=50)
    operators = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name='参与人')
    work_mode = models.CharField('工作模式', max_length=3, choices=WORK_MODE_CHOICES, default='or')
    no = models.SmallIntegerField('序号')

    class Meta:
        verbose_name = '工作流模板步骤'
        verbose_name_plural = '工作流模板步骤'
        ordering = ['flow_template', 'no']

    def __str__(self):
        return self.step_name


class StateType(models.Model):
    """Process的状态

    固定的4个状态值, 见fixture
    """
    name = models.CharField('状态名称', max_length=10, primary_key=True)
    description = models.CharField('状态描述', max_length=500)


class Process(models.Model):
    """发起者发起的业务流程
    """
    company = models.ForeignKey('organization.Company', on_delete=models.PROTECT)
    title = models.CharField('流程标题', max_length=100)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_process')
    updator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True,
                                related_name='updated_process')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_time', '-created_time']

    def current_state(self):
        """当前流程
        """
        return self.state_set.get(active=True)

    def state_type(self):
        """当前流程状态类型
        """
        return self.state_set.get(active=True).state_type.name

    def operators(self):
        """所有流程的操作者
        """
        return State.objects.filter(process=self).values_list('operators', flat=True)


class Contract(models.Model):
    """合同信息
    """
    process = models.OneToOneField(Process, on_delete=models.CASCADE)
    contract_name = models.CharField('合同名称', max_length=100)
    party_a_name = models.CharField('合同甲方名称', max_length=50)
    party_b_name = models.CharField('合同乙方名称', max_length=50)
    contract_content = models.TextField('合同内容')


class State(models.Model):
    """业务流程的工作流步骤数据

    Attributes:
        operators: 此流程的操作者
        work_mode: 多个审核者, 通过到下一个流程的规则是一个审核者通过, 还是所有审核者通过
    """
    process = models.ForeignKey(Process, on_delete=models.CASCADE)
    name = models.CharField('流程步骤名称', max_length=50)
    state_type = models.ForeignKey(StateType, on_delete=models.PROTECT)
    operators = models.ManyToManyField(settings.AUTH_USER_MODEL)
    work_mode = models.CharField(max_length=3, choices=WORK_MODE_CHOICES, default='or')
    active = models.BooleanField('是否是当前状态', default=False)


class ActionType(models.Model):
    """工作流程里触发动作的类型
    """
    name = models.CharField('动作类型', max_length=10, primary_key=True)
    description = models.CharField('动作描述', max_length=500)


class Transition(models.Model):
    """Process的状态流转
    """
    process = models.ForeignKey(Process, on_delete=models.CASCADE)
    current_state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='current_state_transition')
    next_state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='next_state_transition')
    action_type = models.ForeignKey(ActionType, on_delete=models.PROTECT)


class Action(models.Model):
    """用户的操作记录
    """
    process = models.ForeignKey(Process, on_delete=models.CASCADE)
    action_type = models.ForeignKey(ActionType, on_delete=models.PROTECT)
    transition = models.ForeignKey(Transition, on_delete=models.CASCADE)
    operator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    description = models.CharField('备注', max_length=500, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
