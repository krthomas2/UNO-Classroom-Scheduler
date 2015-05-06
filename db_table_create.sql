CREATE TABLE Instructors (
	Instructor_ID int(8) not null,
	LastName varchar(30),
	FirstName varchar(30),
	MiddleName varchar(30),
	Desk_Type enum("Attached", "Tables", "Lab"),
	Board_Type enum("None", "Whiteboard", "Smart Board"),
	Chair_Type enum ("Soft", "Hard"),
	primary key (Inestructor_ID),
	index (FirstName, LastName, MiddleName)	asc
);

CREATE TABLE Classes (
	Subject varchar(4),
	Course_ID int(4),
	Section_ID int (3),
	Class_ID int (5) not null,
	Course_Title varchar(128),
	Lecture_Type enum("In Person", "Online", "Practicum", "Independent Study", "Labaratory", "Field Studies"),
	Credits int(1),
	Instructor_ID int(8),
	Class_Capacity int(3),
	primary key (Class_ID),
	foreign key (Instructor_ID) references Instructors (Instructor_ID),
	index (Class_Capacity) asc,
	Room_Number varchar(8)
);

CREATE TABLE Classrooms (
	Room_Number varchar(8) not null,
	Max_Capacity int(3),
	Desk_Type enum("Attached", "Tables", "Lab"),
	Board_Type enum("None", "Whiteboard", "Smart Board"),
	Chair_Type enum ("Soft", "Hard"),
	primary key (Room_Number),
	index (Max_Capacity) asc
);

CREATE TABLE Class_Groups (
	Group_ID int(4) not null,
	Class_ID int(5) not null,
	Significant boolean,
	primary key (Group_ID, Class_ID),
	foreign key (Class_ID) references Classes (Class_ID)
);

CREATE TABLE Class_Schedule (
	Group_ID int(5) not null,
	Room_Number varchar(8) not null,
	Days varchar(8),
	Start_Time time,
	End_Time time,
	primary key (Group_ID, Room_Number),
	foreign key (Group_ID) references Class_Groups (Group_ID),
	foreign key (Room_Number) references Classrooms (Room_Number)	
);