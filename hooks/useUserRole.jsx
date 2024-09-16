import { useEffect, useState } from 'react';

// Custom hook to check user role from session
const useUserRole = (session) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!session || !session.user || !session.user.organizationMemberships || session.user.organizationMemberships.length === 0) {
      setRole(null); // No valid session or memberships
      return;
    }

    const organizationMemberships = session.user.organizationMemberships;

    for (const membership of organizationMemberships) {
      if (membership.role) {
        setRole(membership.role.toLowerCase()); // Set the role in lowercase
        return;
      }
    }

    setRole(null); // No role found
  }, [session]);

  return role;
};

export default useUserRole;
