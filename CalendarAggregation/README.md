# Calendar Aggregation
How to setup the scripts! 

These scripts and instruction were adapated from: https://developers.google.com/apps-script/samples/automations/vacation-calendar

---

### Step 1: Set up Google Calendar
  1. Open Google Calendar.
  2. Create a new calendar ${Team Vacation Calendar}
  3. In the calendar's settings, under Integrate calendar, copy the Calendar ID.

---

### Step 2: Make a copy of the sample script
  1. Choose if using Email or Group based calendar aggregation.
  2. Copy Script file for chosen aggregation style: Email.gs / Group.gs
  3. GOTO: https://script.google.com/home
  4. Create New project
  5. Paste Selected Script into Code.gs(default) file.

#### UPDATE VARIABLES:

    EMAIL:
        TEAM_CALENDAR_ID: Set this to the ID copied in step 1
        EMAIL: Set array of email strings for the group in question
        MONTHS_IN_ADVANCED: Set the number of months out to scan (Default 3)
        KEYWORDS: Add any additional keywords to filter by in lower case(Comparison done with .ToLower())
    
    GROUP:
        TEAM_CALENDAR_ID: Set this to the ID copied in step 1
        GROUP_EMAIL: The group email for the google group(Can be found in group settings)
        MONTHS_IN_ADVANCED: Set the number of months out to scan (Default 3)
        KEYWORDS: Add any additional keywords to filter by in lower case(Comparison done with .ToLower())

  6. At the left, next to Services, click Add a service add.
  7. Select Google Calendar API and click Add.

  8. Hit the RUN button on the code.cs panel.

Script should now run daily at 12pm central time.


*NOTE:* After running the first time there will be a stored value that will prevent events from being populated unless edited after this date/time.
If you need to override this set lastRun to null after initalized.
