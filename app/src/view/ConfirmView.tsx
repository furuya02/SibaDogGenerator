import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Dispatch } from "react";

export default function ComfirmView({
  confirmDialog,
  setConfirmDialog,
  clearData,
}: {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<React.SetStateAction<boolean>>;
  clearData: () => void;
}) {
  const handleClose = (canBeClear: boolean) => {
    setConfirmDialog(false);
    if (canBeClear) {
      clearData();
    }
  };
  return (
    <Dialog open={confirmDialog} onClose={() => handleClose(false)}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete it?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>No</Button>
        <Button onClick={() => handleClose(true)} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
