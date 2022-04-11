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

## Confluence Embedding

### Google Calendar

1. Go to Settings (upper right gear icon)
2. Select the calendar
3. Update sharing settings

<img width="643" alt="image" src="https://user-images.githubusercontent.com/91081928/162799575-249a0d66-2028-4444-aad1-808ce9d40eb0.png">

4. Scroll down to embed code

<img width="644" alt="image" src="https://user-images.githubusercontent.com/91081928/162799967-7c263a87-f9f9-4dcf-86f5-7b56dfa079bf.png">

5. Customize the layout (We do Weekly view)
    Settings I Used:
<img width="1147" alt="image" src="https://user-images.githubusercontent.com/91081928/162801465-2321f7b7-558d-477f-9469-91a4c5f5d963.png">

6. Copy ONLY the SRC property's url out of the Iframe tag.(Confluence is a butt and doesn't like you injecting HTML direcly)

### Confluence

1. Edit Page you want to put this on.
2. Insert Iframe:
<img width="345" alt="image" src="https://user-images.githubusercontent.com/91081928/162800399-431b4a62-64f1-4963-848e-b3ad944d423d.png">
3. Put Coppied SRC property URL into URL
<img width="312" alt="image" src="https://user-images.githubusercontent.com/91081928/162800606-0c01cb36-caf2-406f-8f3c-74c132bec430.png">
4. Fill in other fields as desired.

Settings I used:

<img width="308" alt="image" src="https://user-images.githubusercontent.com/91081928/162800828-bd170979-14e5-484d-95b6-5c16495f1940.png">

*NOTE:* If not logged into the browser using an Acquia.com Email all events on calendar will just show as busy See attached screenshot:

<img width="835" alt="image" src="https://user-images.githubusercontent.com/91081928/162801025-5a32c740-071f-4122-ab90-3453f79d45d5.png">

VS

<img width="849" alt="image" src="https://user-images.githubusercontent.com/91081928/162801113-a6a3ae4b-559b-438f-8728-31561f39aaa1.png">




