from django.contrib.auth.validators import UnicodeUsernameValidator
from rest_framework import serializers

from organization.models import Company, User


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email')
        # https://medium.com/django-rest-framework/dealing-with-unique-constraints-in-nested-serializers-dade33b831d9
        extra_kwargs = {
            'username': {
                'validators': [UnicodeUsernameValidator()],
            }
        }

    def create(self, validated_data):
        validated_data['password'] = validated_data.get('username') + '123'
        validated_data['company'] = self.context['request'].user.company
        return super().create(validated_data)
