"""
系统角色管理
"""
from rolepermissions.roles import AbstractUserRole


class Admin(AbstractUserRole):
    available_permissions = {
        'create_flow_template': True,
    }


class Requester(AbstractUserRole):
    available_permissions = {
        'request': True,
    }
