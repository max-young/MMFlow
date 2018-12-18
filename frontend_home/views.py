from django.shortcuts import render


def home_page(request):
    """官网首页
    """
    return render(request, 'home/build/index.html')
