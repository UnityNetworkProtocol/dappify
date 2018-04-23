import { financialFolder, conversion, commerceInvoice, commerceOnlineBanking, } from 'assets/shapes'
export default [
  {
    title: 'Transaction Log',
    to: '/dashboard/wallet/analyze',
    svg: commerceInvoice,
  },
  {
    title: 'Verifications',
    to: '/dashboard/wallet/analyze',
    svg: commerceOnlineBanking,
  },
  {
    title: 'Analyze',
    to: '/dashboard/wallet/analyze',
    svg: conversion,
  },
  {
    title: 'Create Wallet',
    to: '/dashboard/wallet/create',
    svg: financialFolder,
  },
]