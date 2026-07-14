export const doctorPhotos = {
  sarah:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=faces",
  ahmed:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=faces",
  ayesha:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=faces",
  hassan:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=faces",
};

export const initialDoctors = [
  {
    id: "doc-1",
    name: "Dr. Sarah Khan",
    specialization: "Cardiologist",
    experience: 15,
    rating: 4.9,
    reviews: 312,
    photo: doctorPhotos.sarah,
    availableDays: ["Mon", "Tue", "Wed", "Thu"],
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
  },
  {
    id: "doc-2",
    name: "Dr. Ahmed Raza",
    specialization: "Dermatologist",
    experience: 9,
    rating: 4.7,
    reviews: 184,
    photo: doctorPhotos.ahmed,
    availableDays: ["Mon", "Wed", "Fri"],
    slots: ["09:30 AM", "11:30 AM", "01:00 PM", "04:00 PM"],
  },
  {
    id: "doc-3",
    name: "Dr. Ayesha Malik",
    specialization: "Pediatrician",
    experience: 12,
    rating: 4.8,
    reviews: 261,
    photo: doctorPhotos.ayesha,
    availableDays: ["Tue", "Thu", "Sat"],
    slots: ["10:00 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
  },
  {
    id: "doc-4",
    name: "Dr. Hassan Ali",
    specialization: "General Physician",
    experience: 7,
    rating: 4.6,
    reviews: 145,
    photo: doctorPhotos.hassan,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    slots: ["08:30 AM", "09:00 AM", "10:30 AM", "03:30 PM"],
  },
];

export const symptomOptions = [
  "Fever",
  "Cough",
  "Headache",
  "Body Ache",
  "Sore Throat",
  "Shortness of Breath",
  "Nausea",
  "Fatigue",
  "Chest Pain",
  "Dizziness",
  "Skin Rash",
  "Stomach Pain",
];
