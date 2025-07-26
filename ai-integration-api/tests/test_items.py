from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

# بيانات تجريبية
item_data = {"title": "Test Title", "description": "Test Description"}
updated_data = {"title": "Updated Title", "description": "Updated Description"}

def test_create_item():
    response = client.post("/items/", json=item_data)
    assert response.status_code == 200
    data = response.json()
    # assert data["message"] == "Item created"
    assert "id" in data
    global created_id
    created_id = data["id"]

def test_read_item():
    response = client.get(f"/items/{created_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_id
    assert data["title"] == item_data["title"]

def test_read_items():
    response = client.get("/items/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(item["id"] == created_id for item in data)

def test_update_item():
    response = client.put(f"/items/{created_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    # assert data["message"] == "Item updated"
    assert data["title"] == updated_data["title"]

def test_delete_item():
    response = client.delete(f"/items/{created_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Item deleted"

    # تأكد أنه تم حذفه فعلاً
    response = client.get(f"/items/{created_id}")
    assert response.status_code == 404
