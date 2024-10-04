import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Dispatch } from "react";

interface ConfirmViewProps {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<React.SetStateAction<boolean>>;
  clearData: () => void;
}

export default function ConfirmView({
  confirmDialog,
  setConfirmDialog,
  clearData,
}: ConfirmViewProps) {
  // ダイアログを閉じるハンドラー
  const handleDialogClose = (canBeClear: boolean) => {
    setConfirmDialog(false);
    if (canBeClear) {
      clearData();
    }
  };
  return (
    <Dialog open={confirmDialog} onClose={() => handleDialogClose(false)}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete it?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDialogClose(false)}>No</Button>
        <Button onClick={() => handleDialogClose(true)} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
