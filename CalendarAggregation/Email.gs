/*
Copyright 2022 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//IF USING GROUP INSTEAD OF EMAIL COMMENT:
//TEAM_CALENDAR_ID, EMAIL,MONTHS_IN_ADVANCE,KEYWORDS, WIDEN_GROUP 


let TEAM_CALENDAR_ID = 'c_srpr29olqnjtm7e4enscoa9tdg@group.calendar.google.com';
let WIDEN_GROUP = 'widen-employees@acquia.com'
// Set the email address of the Google Group that contains everyone in the team.
// Ensure the this has less than 500 members to avoid timeouts.
let EMAIL = ["tyler.firkus@acquia.com", 'ronald.shaw@acquia.com',"test@test.com"]
// Keywords to query for in events
let KEYWORDS = ['vacation', 'ooo', 'out of office', 'offline', 'pto', 'out', 'busy', 'gone', 'mia'];
let MONTHS_IN_ADVANCE = 3;
// Set the ID of the team calendar to add events to. You can find the calendar's
// ID on the settings page.


/**
 * Sets up the script to run automatically every hour.
 */
function setupEmail() {
  
  let triggers = ScriptApp.getProjectTriggers();
  if (triggers.length > 0) {
    throw new Error('Triggers are already setup.');
  }
  ScriptApp.newTrigger('sync').timeBased().everyDays(1).atHour(12).inTimezone("America/Chicago").create();
  // Runs the first sync immediately.
  syncEmail();
}

/**
 * Looks through the group members' public calendars and adds any
 * 'vacation' or 'out of office' events to the team calendar.
 */
function syncEmail() {
  // Defines the calendar event date range to search.
  let today = new Date();
  let maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + MONTHS_IN_ADVANCE);

  // Determines the time the the script was last run.
  let lastRun = PropertiesService.getScriptProperties().getProperty('lastRun');
  lastRun = lastRun ? new Date(lastRun) : null;

  // For each user, finds events having one or more of the keywords in the event
  // summary in the specified date range. Imports each of those to the team
  // calendar.
  let count = 0;
  //Get WidenUser's Emails
  let widenUsers = GroupsApp.getGroupByEmail(WIDEN_GROUP).getUsers().map(user => user.getEmail());

  // Filter so only emails from the Widen_employee group are used
  let filteredEmails = EMAIL.filter(email => {
    return widenUsers.includes(email)
  })
  
  filteredEmails.forEach(function(email) {
    console.log(email);
    let username = email.split('@')[0];
    KEYWORDS.forEach(function(keyword) {
      let events = findEventsEmail(email, keyword, today, maxDate, lastRun);
      events.forEach(function(event) {
        importEventEmail(username, event);
        count++;
      }); // End foreach event.
    }); // End foreach keyword.
  }); // End foreach user.

  PropertiesService.getScriptProperties().setProperty('lastRun', today);
  console.log('Imported ' + count + ' events');
}

/**
 * Imports the given event from the user's calendar into the shared team
 * calendar.
 * @param {string} username The team member that is attending the event.
 * @param {Calendar.Event} event The event to import.
 */
function importEventEmail(username, event) {
  event.summary = '[' + username + '] ' + event.summary;
  event.organizer = {
    id: TEAM_CALENDAR_ID,
  };
  event.attendees = [];
  console.log('Importing: %s', event.summary);
  try {
    Calendar.Events.import(event, TEAM_CALENDAR_ID);
  } catch (e) {
    console.error('Error attempting to import event: %s. Skipping.',
        e.toString());
  }
}

/**
 * In a given user's calendar, looks for occurrences of the given keyword
 * in events within the specified date range and returns any such events
 * found.
 * @param {Session.User} user The user to retrieve events for.
 * @param {string} keyword The keyword to look for.
 * @param {Date} start The starting date of the range to examine.
 * @param {Date} end The ending date of the range to examine.
 * @param {Date} optSince A date indicating the last time this script was run.
 * @return {Calendar.Event[]} An array of calendar events.
 */
function findEventsEmail(email, keyword, start, end, optSince) {
  let params = {
    q: keyword,
    timeMin: formatDateAsRFC3339(start),
    timeMax: formatDateAsRFC3339(end),
    showDeleted: true,
  };
  if (optSince) {
    // This prevents the script from examining events that have not been
    // modified since the specified date (that is, the last time the
    // script was run).
    params.updatedMin = formatDateAsRFC3339(optSince);
  }
  let pageToken = null;
  let events = [];
  do {
    params.pageToken = pageToken;
    let response;
    try {
      response = Calendar.Events.list(email, params);
    } catch (e) {
      console.error('Error retriving events for %s, %s: %s; skipping',
          email, keyword, e.toString());
      continue;
    }
    events = events.concat(response.items.filter(function(item) {
      return shoudImportEventEmail(email, keyword, item);
    }));
    pageToken = response.nextPageToken;
  } while (pageToken);
  return events;
}

/**
 * Determines if the given event should be imported into the shared team
 * calendar.
 * @param {Session.User} user The user that is attending the event.
 * @param {string} keyword The keyword being searched for.
 * @param {Calendar.Event} event The event being considered.
 * @return {boolean} True if the event should be imported.
 */
function shoudImportEventEmail(email, keyword, event) {
  // Filters out events where the keyword did not appear in the summary
  // (that is, the keyword appeared in a different field, and are thus
  // is not likely to be relevant).
  if (event.summary.toLowerCase().indexOf(keyword) < 0) {
    return false;
  }
  if (!event.organizer || event.organizer.email == email) {
    // If the user is the creator of the event, always imports it.
    return true;
  }
  // Only imports events the user has accepted.
  if (!event.attendees) return false;
  let matching = event.attendees.filter(function(attendee) {
    return attendee.self;
  });
  return matching.length > 0 && matching[0].responseStatus == 'accepted';
}

/**
 * Returns an RFC3339 formated date String corresponding to the given
 * Date object.
 * @param {Date} date a Date.
 * @return {string} a formatted date string.
 */
function formatDateAsRFC3339(date) {
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd\'T\'HH:mm:ssZ');
}
