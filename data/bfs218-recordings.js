/* BFS218 asynchronous instructor-video registry.
   Add an entry only after the video is ready for students. This course has no live classes;
   every entry is an optional weekly talk from the professor.
   Supported platforms: youtube and zoom. Never place meeting passcodes or private credentials here.
   Example:
   "2": {
     "kind": "update",
     "platform": "youtube",
     "videoId": "YOUTUBE_ID",
     "title": "Week 2 video from your professor",
     "date": "2026-09-15",
     "access": "Captions available in the player",
     "transcriptUrl": ""
   }
*/
window.BFS218_RECORDINGS = {};
