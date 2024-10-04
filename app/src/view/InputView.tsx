import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Params } from "../App";

interface InputViewProps {
  params: Params;
  handleSetParams: (params: Params) => void;
}

function InputView({ params, handleSetParams }: InputViewProps) {
  return (
    <>
      {/* プロンプト入力フィールド */}
      <TextField
        label="Propmt"
        value={params.prompt}
        onChange={(e) => {
          handleSetParams({ ...params, prompt: e.target.value });
        }}
      />
      <Stack
        mt={2}
        ml={5}
        mr={5}
        direction="row"
        justifyContent="start"
        spacing={2}
      >
        {/* 写真・アニメ選択トグルボタン */}
        <ToggleButtonGroup
          color="primary"
          value={params.dataType}
          exclusive
          onChange={(_e, value) => {
            handleSetParams({ ...params, dataType: value });
          }}
        >
          <ToggleButton value="photo">Photo</ToggleButton>
          <ToggleButton value="anime">Anime</ToggleButton>
        </ToggleButtonGroup>
        {/* ステップ数入力フィールド */}
        <TextField
          label="Steps"
          type="number"
          value={params.steps}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          onChange={(e) => {
            handleSetParams({ ...params, steps: parseInt(e.target.value) });
          }}
        />
        {/* シード値入力フィールド */}
        <TextField
          label="Seed"
          type="number"
          value={params.seed}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          onChange={(e) => {
            handleSetParams({ ...params, seed: parseInt(e.target.value) });
          }}
        />
      </Stack>
    </>
  );
}

export default InputView;
