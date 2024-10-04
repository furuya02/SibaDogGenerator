# SibaDogGenerator


## Install

```
% git clone https://github.com/furuya02/SibaDogGenerator.git
% cd SibaDogGenerator
```

## React

```
% cd app
% npm install
% npm start
```

## Docker

* Dockerイメージは、Jetson AGX Orin (JetPack 6.1) で利用されることを想定しています

### イメージの作成

```
$ docker build -t api:latest .

$ docker images
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
api          latest    c0141269cd02   10 seconds ago   14.9GB
```

### 起動
* モデルのキャッシュのため /data 生成した画像の保存のため /home をそれぞれマウントしています

```
$ docker run --runtime nvidia -it --rm --network host --shm-size=8g -v $(pwd)/home:/home -v $(pwd)/home/data:/data api:latest

INFO:     Will watch for changes in these directories: ['/home']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [19] using StatReload
Loading pipeline components...: 100%|█████████████████████████████████████████████████████████| 7/7 [00:02<00:00,  2.83it/s]
100%|████████████████████████████████████████████████| 1/1 [00:01<00:00,  1.21s/it]
INFO:     Started server process [21]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

