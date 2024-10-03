import glob
import time
import os
import torch
import random
from fastapi import FastAPI, Response
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image

base_path = "/home"
output_path = "/output"


def generateData(
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

prompt = "dmy"
output_filename = "/tmp/dmy.png"
seed = random.randint(1, 10000)
step = 1

generateData(
    pipe,
    prompt,
    seed,
    step,
    output_filename,
)

app = FastAPI()
app.add_middleware(  # CORS
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


@app.post("/generate")
async def generate(params: Params):
    prompt = "{}".format(params.prompt)
    t = int(time.time() * 1000)
    output_filename = "{}/{}/{}.png".format(base_path, output_path, t)
    seed = random.randint(1, 10000) if params.seed == -1 else params.seed
    steps = params.steps
    print("steps:{} seed:{}".format(steps, seed))
    generateData(
        pipe,
        prompt,
        seed,
        steps,
        output_filename,
    )
    output_filename = "{}/{}/{}.png".format(base_path, output_path, t)
    url = "{}/{}.png".format(output_path, t)
    return {"url": url}


@app.get("/clear")
async def clear():
    path = "{}{}/*.png".format(base_path, output_path)
    print("clear path:{}".format(path))
    for p in glob.glob(path, recursive=True):
        print(p)
        if os.path.isfile(p):
            os.remove(p)
    return {"status": "OK"}


@app.get("/fetch")
async def fetch():
    file_names = glob.glob("output/*.png")
    list = []
    for file in file_names:
        list.append("{}".format(file))
    list.sort(reverse=True)
    return {"list": list}


@app.get("/output/{filename}")
async def read_item(filename):
    with open("{}/{}/{}".format(base_path, output_path, filename), "rb") as f:
        return Response(content=f.read(), media_type="image/png")
