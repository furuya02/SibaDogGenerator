FROM dustynv/jetson-inference:r36.3.0
RUN pip3 install diffusers==0.30.3 transformers==4.45.1 ftfy accelerate fastapi uvicorn
COPY api.py start.sh /
RUN chmod 755 /start.sh
# diffusersでダウンロードされるモデルをマウントしたディスクにするためキャッシュ指定設定する
ENV XDG_CACHE_HOME="/data"
CMD ["/bin/bash","/start.sh"]
