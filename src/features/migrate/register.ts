import { registerAdapter } from './registry';
import csv from './adapters/generic.csv';
import api from './adapters/generic.api';
import emoney from './adapters/advisor.emoney';
import moneyguidepro from './adapters/advisor.moneyguide';
import rightcapital from './adapters/advisor.rightcapital';
import qbo from './adapters/accountant.qbo';
import clio from './adapters/attorney.clio';
import dotloop from './adapters/realtor.dotloop';
import opendorse from './adapters/nil.opendorse';

export function registerAllMigrateAdapters(){
  [csv, api, emoney, moneyguidepro, rightcapital, qbo, clio, dotloop, opendorse].forEach(registerAdapter);
}