import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";

const StudentPage = async () => {

  const classes: any[] = [];

  if (!classes || classes.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-white p-4 rounded-md text-center">
          <h1 className="text-xl font-semibold">No Classes Found</h1>
          <p>You are not enrolled in any classes yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classes[0].name || 'Your Class'})</h1>
          <BigCalendarContainer type="classId" id={classes[0].id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;