from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def flow(request):
    """后台
    """
    return render(request, 'flow_react/build/index.html')
