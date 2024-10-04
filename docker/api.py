import glob
import os
import random
import time
import torch
from fastapi import FastAPI, Response
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image
from fastapi.responses import FileResponse

BASE_PATH = "/home"
OUTPUT_PATH = "output"


# 画像を生成し、指定されたファイル名で保存する
def generate_data(
    pipe,
    prompt,
    seed,
    steps,
    output_filename,
):
    generator = torch.Generator("cuda").manual_seed(seed)
    image = pipe(
        prompt=prompt,
        num_inference_steps=steps,
        generator=generator,
        guidance_scale=0.0,
    ).images[0]
    image.save(output_filename)


# 　起動時にパパイプラインを作成し、一度ダミー画像を生成する
pipe = AutoPipelineForText2Image.from_pretrained(
    "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16"
)
pipe.to("cuda")

# ダミー画像生成のためのパラメータ
PROPMPT = "dmy"
OUTPUT_FILENAME = "/tmp/dmy.png"
SEED = random.randint(1, 10000)
STEPS = 1

# ダミー画像を生成
generate_data(
    pipe,
    PROPMPT,
    SEED,
    STEPS,
    OUTPUT_FILENAME,
)

app = FastAPI()
app.add_middleware(  # CORS設定
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Params(BaseModel):
    prompt: str
    steps: int
    seed: int


# 画像生成のエンドポイント
@app.post("/generate")
async def generate(params: Params):
    prompt = params.prompt
    timestamp = int(time.time() * 1000)
    output_filename = f"{BASE_PATH}/{OUTPUT_PATH}/{timestamp}.png"
    seed = random.randint(1, 10000) if params.seed == -1 else params.seed
    steps = params.steps

    # 画像を生成
    generate_data(
        pipe,
        prompt,
        seed,
        steps,
        output_filename,
    )

    # 生成された画像のURLを返す
    url_path = f"/{OUTPUT_PATH}/{timestamp}.png"
    return {"url": url_path}


# 出力ディレクトリ内のすべてのPNGファイルを削除するエンドポイント
@app.get("/clear")
async def clear_output_directory():
    png_files = glob.glob(f"{OUTPUT_PATH}/*.png", recursive=True)
    for png_file in png_files:
        try:
            os.remove(png_file)
        except Exception as e:
            print(f"Error deleting file {png_file}: {e}")
    return {"status": "OK"}


# 出力ディレクトリ内のすべてのPNGファイルを取得するエンドポイント
@app.get("/fetch")
async def fetch_images():
    png_files = glob.glob(f"{OUTPUT_PATH}/*.png", recursive=True)
    file_list = [f"{png_file}" for png_file in png_files]
    return {"list": file_list}


# 指定されたファイル名の出力ファイルを取得するエンドポイント
@app.get("/output/{filename}")
async def get_output_file(filename):
    file_path = f"{BASE_PATH}/{OUTPUT_PATH}/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    else:
        return {"error": "File not found"}
