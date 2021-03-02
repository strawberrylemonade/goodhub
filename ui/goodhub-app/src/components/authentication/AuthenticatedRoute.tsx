import { FC, useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

import { AuthenticationState, useAuthenticationService } from '../../services/authentication-service';
import { getPerson, PersonState, usePersonService } from '../../services/person-service';
import Loading from '../generic/Loading';
 
const AuthenticatedRoute: FC<RouteProps> = ({ ...props }) => {
  const [authState, user] = useAuthenticationService(state => [state.state, state.user]);
  const [personState, setPerson, setRequiresOnboarding] = usePersonService(state => [state.state, state.setPerson, state.setRequiresOnboarding]);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      console.log(authState);
      // If the person isn't unknown, this has already happened or something has gone wrong
      if (personState !== PersonState.Unknown || authState === AuthenticationState.Unauthenticated) return;
      try {
        const response = await getPerson(user!.id);
        setPerson(response);
      } catch (e) {
        // If person doesn't exist but is successfully logged in, that indicates that they need to be onboarded
        if (e.code !== 404) { 
          throw e;
        }

        setRequiresOnboarding();
      }
    })()
  }, [authState, personState, user, setPerson, setRequiresOnboarding])


  // If the user is not authentication, redirect them to a logon page
  if (authState === AuthenticationState.Unauthenticated) {
    history.push('/me/login');
  }
  
  // If the user is logged in and the status of them as a person is unknown, wait until it is
  if (personState === PersonState.Unknown) {
    return <Loading></Loading>
  }
    
  // If the user is logged in but has not been onboarded to a person yet, redirect them to the onboarding page
  if (personState === PersonState.RequiresOnboarding) {
    history.push('/me/onboarding');
  }

  // If they're a user & a person, go ahead and continue to what they wanted to see
  return <Route {...props}></Route> 
}

export default AuthenticatedRoute;