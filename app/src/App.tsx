import axios from "axios";
import React, { Dispatch, useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Button,
  FormControlLabel,
  ImageList,
  ImageListItem,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import BuildIcon from "@mui/icons-material/Build";
import InputView from "./view/InputView";
import ComfirmView from "./view/ConfirmView";
import ModalView from "./view/ModalView";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

const HOST = "http://192.168.1.31:8000";

export type ItemData = {
  url: string;
  title: string;
};

export type DataType = "photo" | "anime";

export type Params = {
  prompt: string;
  dataType: DataType;
  steps: number;
  seed: number;
};

// データをフェッチする関数
const fetchData = async (
  setItemData: Dispatch<React.SetStateAction<ItemData[]>>
) => {
  const url = `${HOST}/fetch`;
  const response = await axios.get(url);
  if (response.data.list) {
    const newItemData: ItemData[] = response.data.list.map((data: string) => {
      const fileUrl = `${HOST}/${data}`;
      return { url: fileUrl, title: "Breakfast" };
    });
    setItemData(newItemData);
  }
};

// プロンプトを翻訳する関数
const translatePrompt = async (prompt: string): Promise<string | undefined> => {
  // .env にAWSの認証情報を設定してください
  const client = new TranslateClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
      sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN!,
    },
  });
  const input = {
    Text: prompt,
    SourceLanguageCode: "ja",
    TargetLanguageCode: "en",
  };
  const command = new TranslateTextCommand(input);
  try {
    const response = await client.send(command);
    return response.TranslatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return undefined;
  }
};

// 画像を生成する関数
const generateData = async (
  params: Params,
  itemData: ItemData[],
  setItemData: Dispatch<React.SetStateAction<ItemData[]>>,
  setLoading: Dispatch<React.SetStateAction<boolean>>,
  setCredentialsError: Dispatch<React.SetStateAction<boolean>>
): Promise<ItemData[]> => {
  setLoading(true);

  let promptEn: string | undefined = params.prompt;
  setCredentialsError(false);
  if (params.prompt) {
    promptEn = await translatePrompt(params.prompt);
    if (!promptEn) {
      setCredentialsError(true);
    }
  }

  const prompt = `(a Shiba Dog , kawaii), ${promptEn}, ${params.dataType}`;

  const url = `${HOST}/generate`;
  const data = {
    prompt: prompt,
    seed: params.seed,
    steps: params.steps,
  };
  const response = await axios.post(url, data);
  const newItemData = [...itemData];

  if (response.data.url) {
    const url = `${HOST}${response.data.url}`;
    newItemData.unshift({ url: url, title: "Breakfast" });
    setItemData(newItemData);
  }
  setLoading(false);
  return newItemData;
};

// 全ての画像を削除する関数
const handleClearData = async (
  setItemData: Dispatch<React.SetStateAction<ItemData[]>>
) => {
  const url = `${HOST}/clear`;
  const response = await axios.get(url);
  if (response.data.status === "OK") {
    setItemData([]);
  }
};

// setIntervalの中から画像を生成する時に参照するためのグローバル変数
declare global {
  var auto: boolean;
  var timer: NodeJS.Timer | null;
  var params: Params | undefined;
}
global.auto = false;
global.timer = null;
global.params = undefined;

function App() {
  const [itemData, setItemData] = useState<ItemData[]>([]);

  const [params, setParams] = useState<Params>({
    prompt: "走っている",
    dataType: "photo",
    steps: 1,
    seed: -1,
  });
  global.params = params; // グローバル変数の初期化
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [modalDialog, setModalDialog] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [credentialsError, setCredentialsError] = useState<boolean>(false);

  useEffect(() => {
    fetchData(setItemData);
  }, []);

  function handleClickImage(event: any): void {
    setPreviewImage(event.target.src);
    setModalDialog(true);
  }

  function handleAuto(): void {
    if (global.auto) {
      let newItemData = [...itemData];
      global.timer = setInterval(async () => {
        const newParams = { ...global.params } as Params;
        newItemData = await generateData(
          newParams,
          newItemData,
          setItemData,
          setLoading,
          setCredentialsError
        );
      }, 3000);
    } else {
      clearInterval(global.timer!);
    }
  }

  function handleSetParams(params: Params) {
    setParams(params);
    // グローバル変数も盲信する
    global.params = params;
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            柴犬ジェネレーター
          </Typography>
        </Toolbar>
      </AppBar>
      {credentialsError ? (
        <>
          <Alert variant="filled" severity="error">
            .env に認証情報が設定されているか確認してください
          </Alert>
        </>
      ) : (
        <></>
      )}

      <Stack
        mt={2}
        ml={5}
        mr={5}
        direction="column"
        justifyContent="start"
        spacing={2}
      >
        <InputView params={params} handleSetParams={handleSetParams} />

        <Stack ml={5} mr={5} direction="row" justifyContent="start" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoGenerate}
                onChange={() => {
                  global.auto = !autoGenerate;
                  setAutoGenerate(!autoGenerate);
                  handleAuto();
                }}
                color="info"
              />
            }
            label="Auto"
          />

          <LoadingButton
            onClick={() =>
              generateData(
                params,
                itemData,
                setItemData,
                setLoading,
                setCredentialsError
              )
            }
            endIcon={<BuildIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Generate
          </LoadingButton>

          <Button variant="outlined" onClick={() => setConfirmDialog(true)}>
            Clear
          </Button>
        </Stack>
        <ImageList sx={{ width: "100%", height: "100%" }} cols={7} gap={2}>
          {itemData.map((item) => (
            <ImageListItem key={item.url} onClick={handleClickImage}>
              <img src={`${item.url}`} alt={item.title} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </Stack>
      <ComfirmView
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        clearData={() => handleClearData(setItemData)}
      />
      <ModalView
        modalDialog={modalDialog}
        setModalDialog={setModalDialog}
        src={previewImage}
      />
    </div>
  );
}

export default App;
