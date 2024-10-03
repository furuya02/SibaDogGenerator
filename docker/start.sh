cd home
cp /api.py  .
uvicorn api:app --reload  --host=0.0.0.0