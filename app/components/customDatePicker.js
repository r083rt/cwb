import React from 'react';
import {View} from 'react-native';
import DatePicker from 'react-native-date-picker';

const CustomDatePicker = ({date, title, open, mode, onCancel, onConfirm}) => {
  return (
    <View>
      <DatePicker
        modal
        locale="id"
        open={open}
        title={title}
        cancelText="Tutup"
        confirmText="Pilih"
        style={{fontColor: '#009788'}}
        is24hourSource="locale"
        textColor="#009788"
        date={date}
        onConfirm={onConfirm}
        onCancel={onCancel}
        mode={mode}
      />
    </View>
  );
};

export default CustomDatePicker;
