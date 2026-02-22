import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ActivityID = Nat;

  type Category = {
    #sports;
    #academic;
    #arts;
    #social;
  };

  type Activity = {
    id : ActivityID;
    title : Text;
    description : Text;
    date : Time.Time;
    time : Text;
    location : Text;
    category : Category;
    organizer : Principal;
    participantCount : Nat;
  };

  type ActivityInput = {
    title : Text;
    description : Text;
    date : Time.Time;
    time : Text;
    location : Text;
    category : Category;
  };

  module Activity {
    public func compare(a : Activity, b : Activity) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextActivityID : ActivityID = 1;

  let studentEvents = Map.empty<ActivityID, Activity>();
  let activityParticipants = Map.empty<ActivityID, List.List<Principal>>();
  let userRegistrations = Map.empty<Principal, List.List<ActivityID>>();

  public shared ({ caller }) func createActivity(input : ActivityInput) : async ActivityID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create activities");
    };

    let activity : Activity = {
      id = nextActivityID;
      title = input.title;
      description = input.description;
      date = input.date;
      time = input.time;
      location = input.location;
      category = input.category;
      organizer = caller;
      participantCount = 0;
    };

    studentEvents.add(nextActivityID, activity);
    activityParticipants.add(nextActivityID, List.empty<Principal>());
    nextActivityID += 1;
    activity.id;
  };

  public query ({ caller }) func getUpcomingActivities() : async [Activity] {
    studentEvents.values().toArray().sort();
  };

  public query ({ caller }) func getActivityDetails(activityId : ActivityID) : async ?Activity {
    studentEvents.get(activityId);
  };

  public shared ({ caller }) func registerForActivity(activityId : ActivityID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for activities");
    };

    switch (studentEvents.get(activityId)) {
      case (null) {
        Runtime.trap("Activity does not exist");
      };
      case (?activity) {
        switch (activityParticipants.get(activityId)) {
          case (null) {
            Runtime.trap("Activity participants not found");
          };
          case (?participants) {
            let updatedParticipants = List.fromIter(participants.values());
            updatedParticipants.add(caller);

            let updatedActivity = {
              activity with
              participantCount = updatedParticipants.size();
            };

            studentEvents.add(activityId, updatedActivity);
            activityParticipants.add(activityId, updatedParticipants);

            switch (userRegistrations.get(caller)) {
              case (null) {
                let newRegistrations = List.empty<ActivityID>();
                newRegistrations.add(activityId);
                userRegistrations.add(caller, newRegistrations);
              };
              case (?registrations) {
                registrations.add(activityId);
              };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserRegistrations(user : Principal) : async [ActivityID] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own registrations");
    };
    
    switch (userRegistrations.get(user)) {
      case (null) { [] };
      case (?registrations) { registrations.toArray() };
    };
  };

  public query ({ caller }) func getParticipants(activityId : ActivityID) : async [Principal] {
    switch (activityParticipants.get(activityId)) {
      case (null) { [] };
      case (?participants) { participants.toArray() };
    };
  };
};
