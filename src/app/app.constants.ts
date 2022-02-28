import { Injectable } from '@angular/core';


@Injectable()
export class Configuration {
    //deploy param.
    //public static readonly server = 'http://turing.cs.ttu.ee:9998'; 
    //local param.
    public static readonly server = 'http://localhost:9998';
    public static readonly serverAuthUrl =   Configuration.server + '/api/login';
    public static readonly serverLogOutUrl = Configuration.server + '/api/logout'
    public static readonly serverRegisterUrl = Configuration.server + '/api/register'
    public static readonly overallData = Configuration.server + '/api/tree'
    public static readonly personalData = Configuration.server + '/api/data'
    public static readonly updateData = Configuration.server + '/api/update'

}