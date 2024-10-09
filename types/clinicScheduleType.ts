import ClinicType from './clinicType';

interface clinicScheduleType {
    user: string;
    clinic: ClinicType;
    date: Date;
    time: string;
    location: string;
    status: string;
}

export default clinicScheduleType;