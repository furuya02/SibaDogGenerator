import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Params } from "../App";

function InputView({
  params,
  handleSetParams,
}: {
  params: Params;
  handleSetParams: (params: Params) => void;
}) {
  return (
    <>
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
        <ToggleButtonGroup
          color="primary"
          value={params.dataType}
          exclusive
          onChange={(_e, v) => {
            handleSetParams({ ...params, dataType: v });
          }}
        >
          <ToggleButton value="photo">Photo</ToggleButton>
          <ToggleButton value="anime">Anime</ToggleButton>
        </ToggleButtonGroup>
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
