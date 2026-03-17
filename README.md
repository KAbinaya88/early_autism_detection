🧩 ASD Video Annotator
A specialized web-based tool designed for clinicians and researchers to annotate behavioral videos. This application allows users to upload videos, 
capture specific frames, and tag behaviors (such as eye gaze, gestures, and vocalizations) for data analysis.

🚀 Features
1. Frame-by-Frame Control: Precision seeking to capture the exact millisecond a behavior occurs.
2. Dynamic Labeling: Pre-set categories for ASD-specific observations (Joint Attention, Echolalia, etc.).
3. Snapshot Capture: Automatically generates a PNG image of the specific frame being annotated.
4. Data Export: Export your findings in JSON, XML, or a ZIP bundle containing all captured frames.
5. Hotkeys: Use the Spacebar for play/pause and Number keys (1-5) for quick emotion tagging.
6. Consensus Merging: Tooling to merge annotations from multiple researchers into a single "master" file.

🛠️ Technical Stack
1. Backend: Python (Flask)
2. Frontend: HTML5, CSS3, JavaScript (Vanilla)
3. Database: SQLite (for event and user management)
4. Templates: Jinja2

💻 Installation & Setup
1. Clone the repository:
   git clone https://github.com/yourusername/asd-annotator.git
   cd asd-annotator
2. Create a virtual environment:
   python -m venv venv
   source venv/bin/activate
3. Install dependencies:
   pip install -r requirements.txt
4. Initialize the database:
   python app.py
5. Run the app:
   flask run

📖 How to Use
1. Upload
Go to the Upload page and select an MP4 video. Once uploaded, it will appear on your Dashboard.
2. Annotate
Click Annotate next to a video. Use the player to find a specific behavior.
Use ◀ Frame and Frame ▶ for micro-adjustments.
Select a Category (e.g., Gesture).
Select a Label (e.g., Pointing).
Click Save to capture the frame and log the data.
3. Export
From the Dashboard, you can download the raw data in JSON or XML formats for use in statistical software like R or Python.





