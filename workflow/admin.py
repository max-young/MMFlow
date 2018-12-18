from django.contrib import admin

from .models import FlowTemplate, FlowTemplateStep, Process


class FlowTemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'flow_template_name')


class FlowTemplateStepAdmin(admin.ModelAdmin):
    list_display = ('id', 'flow_template', 'step_name')


admin.site.register(FlowTemplate, FlowTemplateAdmin)
admin.site.register(FlowTemplateStep, FlowTemplateStepAdmin)
admin.site.register(Process)
