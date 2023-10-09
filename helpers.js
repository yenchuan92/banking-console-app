import moment from "moment";

export const isInvalidDate = (date, format) => {
  return (
    !moment(date, format, true).isValid() ||
    date.length !== format.length ||
    !/\d/.test(date)
  );
};
