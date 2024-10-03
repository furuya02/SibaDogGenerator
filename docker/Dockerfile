FROM dustynv/jetson-inference:r36.3.0
RUN pip3 install diffusers==0.30.3 transformers==4.45.1 ftfy accelerate
ENV XDG_CACHE_HOME="/data"
RUN pip3 install fastapi uvicorn
COPY api.py /
COPY --chmod=755 start.sh /
CMD ["/bin/bash","/start.sh"]
