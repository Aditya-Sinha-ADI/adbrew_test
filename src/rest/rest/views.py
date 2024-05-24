from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import logging
import os
from pymongo import MongoClient
from rest_framework.parsers import JSONParser


class DatabaseConnection:
    def __init__(self, db_name='test_db'):
        self.mongo_uri = 'mongodb://' + \
            os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
        self.db = MongoClient(self.mongo_uri)[db_name]


class DatabaseHandler:
    def __init__(self, db):
        self.db = db

    def find_todos(self):
        return list(self.db.todos.find())

    def insert_todo(self, todo_data):
        return self.db.todos.insert_one(todo_data)


class TodoSerializer:
    @staticmethod
    def serialize(todo):
        todo['_id'] = str(todo['_id'])
        return todo


class TodoListView(APIView):

    parser_classes = [JSONParser]

    def __init__(self):
        self.db_connection = DatabaseConnection('todo_db')
        self.db_handler = DatabaseHandler(self.db_connection.db)

    def get(self, request):
        try:
            todos = self.db_handler.find_todos()
            serialized_todos = [
                TodoSerializer.serialize(todo) for todo in todos]
            return Response(serialized_todos, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Failed to fetch todos: {e}")
            return Response({"error": "Failed to fetch todos"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            todo_data = request.data
            if not todo_data:
                return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

            result = self.db_handler.insert_todo(todo_data)
            return Response({"message": "Todo item created", "id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError as e:
            logging.error(f"JSON parse error: {e}")
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error(f"Failed to create todo: {e}")
            return Response({"error": "Failed to create todo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
