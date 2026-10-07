def total_study_minutes(sessions):
    seen = {}
    for session in sessions:
        if not isinstance(session, dict):
            raise ValueError("A session must be a dictionary")
        identity = session.get("id")
        minutes = session.get("minutes")
        if not isinstance(identity, str) or not identity.strip():
            raise ValueError("A session needs a nonempty ID")
        if isinstance(minutes, bool) or not isinstance(minutes, int) or not 1 <= minutes <= 1440:
            raise ValueError("Minutes must be an integer from 1 to 1440")
        if identity in seen and seen[identity] != minutes:
            raise ValueError("Duplicate session ID has conflicting minutes")
        seen[identity] = minutes
    return sum(seen.values())
