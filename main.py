from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from deta import Deta

deta = Deta()
db = deta.Base("2048-state")

app = FastAPI()

@app.post("/api")
async def save(r: Request):
    data = await r.json()
    db.put(data)
    return data

@app.get("/api")
def fetch(key: str = None):
    return db.get(key)    

@app.delete("/api")
def delete(key: str = None):
    return db.delete(key)


app.mount("/", StaticFiles(directory=".", html="true"), name="static")

