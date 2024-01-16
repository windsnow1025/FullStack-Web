import React, {useState} from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import {Tooltip} from "@mui/material";
import '../../src/asset/css/react.css';

const filter = createFilterOptions();

function AutocompleteComponent({ options, label, handleOptionClick, handleDelete, handleAdd, handleUpdate }) {

  const [value, setValue] = useState(null);

  const handleDeleteClick = (event, index) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDelete(index);
    }
  };

  const handleUpdateClick = (event, index, title) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to update this item?')) {
      handleUpdate(index, title);
    }
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
            isNew: true,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={label}
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option, state) => (
        <li {...props} onClick={() => {
          if (option.isNew) {
            if (window.confirm('Are you sure you want to add this item?')) {
              handleAdd(option.inputValue);
            }
          } else {
            if (window.confirm('Are you sure you want to select this item?')) {
              handleOptionClick(state.index);
            }
          }
        }}>
          {option.title}
          {!option.isNew &&
            <div className="icon-container">
              <Tooltip title="Update">
                <UpdateIcon className="icon-hover" onClick={(event) => handleUpdateClick(event, state.index, option.title)} />
              </Tooltip>
              <Tooltip title="Delete">
                <DeleteIcon className="icon-hover" onClick={(event) => handleDeleteClick(event, state.index)} />
              </Tooltip>
            </div>
          }
        </li>
      )}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={label}/>
      )}
      className="m-2"
    />
  );
}

export default AutocompleteComponent;