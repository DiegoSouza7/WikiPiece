import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './auth'
import RouteSessions from './authSession'
import Redirects from './Redirect'
import Index from './pages/Index'
import Search from './pages/Search'
import PersonagensShow from './pages/PersonagensShow'
import Personagens from './pages/Personagens'
import Piratas from './pages/Piratas'
import Marinheiros from './pages/Marinheiros'
import Revolucionarios from './pages/Revolucionarios'
import GovernoMundial from './pages/GovernoMundial'
import Outros from './pages/Outros'
import AkumasNoMi from './pages/AkumasNoMi'
import Zoan from './pages/Zoan'
import Logia from './pages/Logia'
import Paramecia from './pages/Paramecia'
import Recompensas from './pages/Recompensas'
import Tripulacoes from './pages/Tripulacoes'
import AkumaNoMiShow from './pages/FrutasShow'
import TripulacaoShow from './pages/TripulacaoShow'

import AdmIndex from './adm/pages/Index'
import FrutasAdm from './adm/pages/FrutasAdm'
import PersonagensAdm from './adm/pages/PersonagensAdm'
import RecompensasAdm from './adm/pages/RecompensasAdm'
import TripulaçõesAdm from './adm/pages/TripulaçõesAdm'
import AdmCreateFrutas from './adm/pages/CreateFrutas'
import AdmCreateTripulacoes from './adm/pages/CreateTripulação'
import AdmCreatePersonagens from './adm/pages/CreatePersonagens'
import AdmCreateRecompensas from './adm/pages/CreateRecompensas'
import AdmUpdateFrutas from './adm/pages/UpdateFrutas'
import AdmUpdatePersonagens from './adm/pages/UpdatePersonagens'
import AdmUpdateTripulações from './adm/pages/UpdateTripulação'
import AdmUpdateRecompensas from './adm/pages/UpdadeRecompensas'
import AdmSearch from './adm/pages/Search'
import Login from './adm/pages/Login'
import PasswordReset from './adm/pages/PasswordReset'
import ForgotPassword from './adm/pages/ForgotPassword'


export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/Search" exact component={Search} />
        <Route path="/Personagens:page?" exact component={Personagens} />
        <Route path="/Outros:page?" exact component={Outros} />
        <Route path="/Personagens/:nome" exact component={PersonagensShow} />
        <Route path="/Piratas:page?" exact component={Piratas} />
        <Route path="/Marinheiros:page?" exact component={Marinheiros} />
        <Route path="/Revolucionarios:page?" exact component={Revolucionarios} />
        <Route path="/GovernoMundial:page?" exact component={GovernoMundial} />
        <Route path="/AkumaNoMi:page?" exact component={AkumasNoMi} />
        <Route path="/Zoan:page?" exact component={Zoan} />
        <Route path="/Logia:page?" exact component={Logia} />
        <Route path="/Paramecia:page?" exact component={Paramecia} />
        <Route path="/Recompensas:page?" exact component={Recompensas} />
        <Route path="/Tripulações:page?" exact component={Tripulacoes} />
        <Route path="/AkumaNoMi/:nome" exact component={AkumaNoMiShow} />
        <Route path="/Tripulacao/:nome" exact component={TripulacaoShow} />

        <RouteSessions path="/login" exact component={Login} />
        <RouteSessions path="/passwordReset" exact component={PasswordReset} />
        <RouteSessions path="/forgotPassword" exact component={ForgotPassword} />

        <PrivateRoute path="/adm" exact component={AdmIndex} />
        <PrivateRoute path="/adm/frutas:page?" exact component={FrutasAdm} />
        <PrivateRoute path="/adm/tripulacao:page?" exact component={TripulaçõesAdm} />
        <PrivateRoute path="/adm/recompensas:page?" exact component={RecompensasAdm} />
        <PrivateRoute path="/adm/personagens:page?" exact component={PersonagensAdm} />
        <PrivateRoute path="/adm/search" exact component={AdmSearch} />
        <PrivateRoute path="/adm/create/frutas" exact component={AdmCreateFrutas} />
        <PrivateRoute path="/adm/create/tripulacoes" exact component={AdmCreateTripulacoes} />
        <PrivateRoute path="/adm/create/personagens" exact component={AdmCreatePersonagens} />
        <PrivateRoute path="/adm/create/recompensas" exact component={AdmCreateRecompensas} />
        <PrivateRoute path="/adm/update/frutas/:nome" exact component={AdmUpdateFrutas} />
        <PrivateRoute path="/adm/update/tripulacoes/:nome" exact component={AdmUpdateTripulações} />
        <PrivateRoute path="/adm/update/personagens/:nome" exact component={AdmUpdatePersonagens} />
        <PrivateRoute path="/adm/update/recompensas/:id" exact component={AdmUpdateRecompensas} />

        <Route component={Redirects} />
      </Switch>
    </BrowserRouter>
  )
}