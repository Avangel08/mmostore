import moment from "moment";

const formatDateTime = (date: string) => {
    return moment.parseZone(date).format("DD/MM/YYYY HH:mm");
}

export { formatDateTime };