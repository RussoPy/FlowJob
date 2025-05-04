from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import WorkerSerializer, JobSerializer
from firebase_admin import firestore
from .firebase_config import db
import uuid


@api_view(['GET'])
def index(req):
    return Response('Welcome To home page')


class WorkerViewSet(viewsets.ViewSet):
    def list(self, request):
        workers = db.collection('workers').stream()
        data = [{**w.to_dict(), 'id': w.id} for w in workers]
        return Response(data)

    def retrieve(self, request, pk=None):
        doc = db.collection('workers').document(pk).get()
        if not doc.exists:
            return Response({'error': 'Not found'}, status=404)
        return Response({**doc.to_dict(), 'id': doc.id})

    def create(self, request):
        serializer = WorkerSerializer(data=request.data)
        if serializer.is_valid():
            worker_id = str(uuid.uuid4())
            data = serializer.validated_data
            db.collection('workers').document(worker_id).set({
                **data,
                'created_at': firestore.SERVER_TIMESTAMP
            })
            return Response({'success': True, 'id': worker_id})
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None):
        serializer = WorkerSerializer(data=request.data)
        if serializer.is_valid():
            db.collection('workers').document(pk).update(serializer.validated_data)
            return Response({'success': True})
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        db.collection('workers').document(pk).delete()
        return Response({'success': True})


class JobViewSet(viewsets.ViewSet):
    def list(self, request):
        jobs = db.collection('jobs').stream()
        data = [{**j.to_dict(), 'id': j.id} for j in jobs]
        return Response(data)

    def retrieve(self, request, pk=None):
        doc = db.collection('jobs').document(pk).get()
        if not doc.exists:
            return Response({'error': 'Not found'}, status=404)
        return Response({**doc.to_dict(), 'id': doc.id})

    def create(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            job_id = str(uuid.uuid4())
            data = serializer.validated_data
            db.collection('jobs').document(job_id).set({
                **data,
                'applicants': [],
                'matches': [],
                'rejected': {},
                'is_active': True,
                'created_at': firestore.SERVER_TIMESTAMP
            })
            return Response({'success': True, 'id': job_id})
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            db.collection('jobs').document(pk).update(serializer.validated_data)
            return Response({'success': True})
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        db.collection('jobs').document(pk).delete()
        return Response({'success': True})
