import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, petName, theme) {
  return Array.isArray(name) ? {
    fontWeight:
      petName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  } : {};
}

export default function MultipleSelect(props) {
  const theme = useTheme();
  const [data, setData] = props.data
  const options = props.options
  const multiple = props.multiple
  const [value, setValue] = React.useState(data);
  

  const handleChange = (event) => {
    const {target: { value },} = event;
    // On autofill we get a stringified value.
    const selected = typeof value === 'string' ? value.split(',') : value
    setValue(selected)
    setData(multiple ? selected : selected[0])
    props.handleChange && props.handleChange({
      target: {
        name: props.name,
        value: multiple ? selected : selected[0]
      }
    })
  };

  return (
    <div style={props.style}>
      <FormControl style={{width:"100%", backgroundColor: "white", padding:"15"}}>
        <InputLabel id="demo-multiple-chip-label" >{props.label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple={multiple}
          value={value}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, value, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
