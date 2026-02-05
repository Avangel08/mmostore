import moment from "moment";

const formatDateTime = (date: string) => {
    return moment.parseZone(date).format("DD/MM/YYYY HH:mm");
}

const formatDate = (date: string) => {
    return moment.parseZone(date).format("DD/MM/YYYY");
}
export { formatDateTime, formatDate };