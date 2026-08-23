import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { Container } from '@components/layout';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { useQuery } from '@tanstack/react-query';

interface VerificationStatusData {
  verStatus: string;
  isValid: string;
  verDate: string;
  verTime: string;
  verPlace: string;
  verNec: string;
  verNmc: string;
}

export function VerificationStatusScreen() {
  const ppoNo = 'MG/11xx';
  const { error, data, isLoading } = useQuery({
    queryKey: ['verificationStatus', ppoNo],
    queryFn: () =>
      http.post<VerificationStatusData>(ENDPOINTS.VERIFICATION.STATUS, {
        ppo_no: ppoNo,
      }),
  });
  console.log(data);

  // Error State

  const isPhotoSubmitted = data?.isValid === '03';

  return (
    <Container scrollable className="p-4">
      <View className="w-full items-center gap-4 py-2">
        {/* Status Card */}
        <View className="w-full items-center rounded-xl border border-emerald-300 bg-emerald-100 p-4">
          <Text className="text-center text-base font-bold text-emerald-950">
            Status: {data?.verStatus}
          </Text>
        </View>

        {/* Details Section Header */}
        <Text className="px-2 text-center text-xs font-bold text-emerald-700 underline">
          {isPhotoSubmitted
            ? 'Details of Photo Submitted.'
            : 'Details of the last Face Verification and Self Declaration for Non-Employment or Non Marriage.'}
        </Text>

        {/* Verification Details Card */}
        <View className="w-full gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Date */}
          <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
            <Text className="text-xs font-bold text-gray-700">Date:</Text>
            <Text className="text-xs font-semibold text-gray-900">{data?.verDate}</Text>
          </View>

          {/* Time */}
          <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
            <Text className="text-xs font-bold text-gray-700">Time:</Text>
            <Text className="text-xs font-semibold text-gray-900">{data?.verTime}</Text>
          </View>

          {!isPhotoSubmitted && (
            <>
              {/* Place */}
              <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
                <Text className="text-xs font-bold text-gray-700">Place:</Text>
                <Text className="text-xs font-semibold text-gray-900">{data?.verPlace}</Text>
              </View>

              {/* Non-Employment Declaration */}
              <View className="gap-1 border-b border-gray-100 pb-2">
                <Text className="text-xs font-bold text-gray-700">Type:</Text>
                <Text className="text-[10px] font-bold uppercase text-gray-500">
                  NON-EMPLOYMENT / RE-EMPLOYMENT
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-gray-700">Declaration:</Text>
                  <Text className="text-xs font-semibold text-gray-900">{data?.verNec}</Text>
                </View>
              </View>

              {/* Re-Marriage Declaration */}
              <View className="gap-1">
                <Text className="text-xs font-bold text-gray-700">Type:</Text>
                <Text className="text-[10px] font-bold uppercase text-gray-500">
                  RE-MARRIAGE / NON-MARRIAGE
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-gray-700">Declaration:</Text>
                  <Text className="text-xs font-semibold text-gray-900">{data?.verNmc}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Note Alert */}
        <View className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Text className="text-justify text-xs font-medium leading-relaxed text-amber-900">
            <Text className="font-bold text-amber-950">Note: </Text>
            The frequency of Face Verification is twice in a Calendar year. It will be counted for 6
            months from the date of your Last Face Verification.
          </Text>
        </View>

        {/* Footer Logos */}
        <View className="flex-row items-center justify-center gap-5 pb-2 pt-4">
          <Image
            source={require('../../../shared/assets/images/NIC.png')}
            className="h-8 w-20"
            resizeMode="contain"
          />
          <View className="h-5 w-[1px] bg-gray-200" />
          <Image
            source={require('../../../shared/assets/images/Digital-India.png')}
            className="h-8 w-20"
            resizeMode="contain"
          />
        </View>
      </View>
    </Container>
  );
}
