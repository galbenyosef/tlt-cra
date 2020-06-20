import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import CircularProgress from "@material-ui/core/CircularProgress";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    direction: "rtl"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    paddingRight: 10
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width:1,
    height: 28,
    margin: 4
  }
}));


export const MySelect = React.memo(({data}) => {
  const classes = useStyles();

  const inputRef = React.useRef(null);
  const [inputValue,setInputValue] = React.useState('')
  const [typingTimeout,setTypingTimeout] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filteredData,setFilteredData] = React.useState([])
  const open = Boolean(anchorEl);
  const [loading,setLoading] = React.useState(false)

  const handleInputChange = input => {
    setInputValue(input)
    setLoading(true)
    
    if (typingTimeout) {
      setTypingTimeout(null)
    }
    
    setTypingTimeout(setTimeout(function () {
      setFilteredData(data.filter(e => e.toString().includes(input)))
      if (input)
        setAnchorEl(inputRef.current);
      else
        setAnchorEl(null);
      setLoading(false)
    }, 500));

  }

  const handleClick = event => {
    setAnchorEl(inputRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper component="form" className={classes.root}>
      <Menu
        disableAutoFocus={true}
        disableAutoFocusItem={true}
        id="fade-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        disableEnforceFocus={true}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {filteredData.map(n => (
          <MenuItem>{`${n}`}</MenuItem>
        ))}
      </Menu>

      <InputBase
        value={inputValue}
        onChange={e => handleInputChange(e.currentTarget.value)}
        ref={inputRef}
        className={classes.input}
        placeholder="חיפוש כתובת"
        inputProps={{ "aria-label": "search address" }}
      />
      {
        loading &&
        <CircularProgress />
      }
      
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        onClick={handleClick}
        color="primary"
        className={classes.iconButton}
        aria-label="directions"
      >
        <KeyboardArrowDown />
      </IconButton>
    </Paper>
  );
})
