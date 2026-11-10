rtl.module("DateUtils",["System","SysUtils","Math"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.DaysPerWeek = 7;
  this.WeeksPerFortnight = 2;
  this.MonthsPerYear = 12;
  this.YearsPerDecade = 10;
  this.YearsPerCentury = 100;
  this.YearsPerMillennium = 1000;
  this.DayMonday = 1;
  this.DayTuesday = 2;
  this.DayWednesday = 3;
  this.DayThursday = 4;
  this.DayFriday = 5;
  this.DaySaturday = 6;
  this.DaySunday = 7;
  this.OneHour = 1 / 24;
  this.OneMinute = 1 / 1440;
  this.OneSecond = 1 / 86400;
  this.OneMillisecond = 1 / 86400000;
  this.$rtti.$StaticArray("DaysPerYear$a",{dims: [2], eltype: rtl.word});
  this.DaysPerYear = [365,366];
  this.RecodeLeaveFieldAsIs = 65535;
  this.ApproxDaysPerMonth = 30.4375;
  this.ApproxDaysPerYear = 365.25;
  this.DateOf = function (AValue) {
    var Result = 0.0;
    Result = pas.System.Trunc(AValue);
    return Result;
  };
  this.TimeOf = function (AValue) {
    var Result = 0.0;
    Result = pas.System.Frac(AValue);
    return Result;
  };
  this.IsInLeapYear = function (AValue) {
    var Result = false;
    Result = pas.SysUtils.IsLeapYear($mod.YearOf(AValue));
    return Result;
  };
  this.IsPM = function (AValue) {
    var Result = false;
    Result = $mod.HourOf(AValue) >= 12;
    return Result;
  };
  this.IsValidDate = function (AYear, AMonth, ADay) {
    var Result = false;
    Result = (AYear !== 0) && (AYear < 10000) && $impl.IsValidMonth(AMonth) && (ADay !== 0) && (ADay <= pas.SysUtils.MonthDays[+pas.SysUtils.IsLeapYear(AYear)][AMonth - 1]);
    return Result;
  };
  this.IsValidTime = function (AHour, AMinute, ASecond, AMilliSecond) {
    var Result = false;
    Result = (AHour === 24) && (AMinute === 0) && (ASecond === 0) && (AMilliSecond === 0);
    Result = Result || ((AHour < 24) && (AMinute < 60) && (ASecond < 60) && (AMilliSecond < 1000));
    return Result;
  };
  this.IsValidDateTime = function (AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond) {
    var Result = false;
    Result = $mod.IsValidDate(AYear,AMonth,ADay) && $mod.IsValidTime(AHour,AMinute,ASecond,AMilliSecond);
    return Result;
  };
  this.IsValidDateDay = function (AYear, ADayOfYear) {
    var Result = false;
    Result = (AYear !== 0) && (ADayOfYear !== 0) && (AYear < 10000) && (ADayOfYear <= $mod.DaysPerYear[+pas.SysUtils.IsLeapYear(AYear)]);
    return Result;
  };
  this.IsValidDateWeek = function (AYear, AWeekOfYear, ADayOfWeek) {
    var Result = false;
    Result = (AYear !== 0) && (AYear < 10000) && $impl.IsValidDayOfWeek(ADayOfWeek) && (AWeekOfYear !== 0) && (AWeekOfYear <= $mod.WeeksInAYear(AYear));
    return Result;
  };
  this.IsValidDateMonthWeek = function (AYear, AMonth, AWeekOfMonth, ADayOfWeek) {
    var Result = false;
    Result = (AYear !== 0) && (AYear < 10000) && $impl.IsValidMonth(AMonth) && $impl.IsValidWeekOfMonth(AWeekOfMonth) && $impl.IsValidDayOfWeek(ADayOfWeek);
    return Result;
  };
  this.WeeksInYear = function (AValue) {
    var Result = 0;
    Result = $mod.WeeksInAYear($mod.YearOf(AValue));
    return Result;
  };
  this.WeeksInAYear = function (AYear) {
    var Result = 0;
    var DOW = 0;
    Result = 52;
    DOW = $mod.DayOfTheWeek($mod.StartOfAYear(AYear));
    if ((DOW === 4) || ((DOW === 3) && pas.SysUtils.IsLeapYear(AYear))) Result += 1;
    return Result;
  };
  this.DaysInYear = function (AValue) {
    var Result = 0;
    Result = $mod.DaysPerYear[+pas.SysUtils.IsLeapYear($mod.YearOf(AValue))];
    return Result;
  };
  this.DaysInAYear = function (AYear) {
    var Result = 0;
    Result = $mod.DaysPerYear[+pas.SysUtils.IsLeapYear(AYear)];
    return Result;
  };
  this.DaysInMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    Result = pas.SysUtils.MonthDays[+pas.SysUtils.IsLeapYear(Y)][M - 1];
    return Result;
  };
  this.DaysInAMonth = function (AYear, AMonth) {
    var Result = 0;
    Result = pas.SysUtils.MonthDays[+pas.SysUtils.IsLeapYear(AYear)][AMonth - 1];
    return Result;
  };
  this.Today = function () {
    var Result = 0.0;
    Result = pas.SysUtils.Date();
    return Result;
  };
  this.Yesterday = function () {
    var Result = 0.0;
    Result = pas.SysUtils.Date() - 1;
    return Result;
  };
  this.Tomorrow = function () {
    var Result = 0.0;
    Result = pas.SysUtils.Date() + 1;
    return Result;
  };
  this.IsToday = function (AValue) {
    var Result = false;
    Result = $mod.IsSameDay(AValue,pas.SysUtils.Date());
    return Result;
  };
  this.IsSameDay = function (AValue, ABasis) {
    var Result = false;
    var D = 0.0;
    D = AValue - pas.System.Trunc(ABasis);
    Result = (D >= 0) && (D < 1);
    return Result;
  };
  this.IsSameMonth = function (Avalue, ABasis) {
    var Result = false;
    Result = $mod.YearOf(Avalue) === $mod.YearOf(ABasis);
    Result = Result && ($mod.MonthOf(Avalue) === $mod.MonthOf(ABasis));
    return Result;
  };
  this.PreviousDayOfWeek = function (DayOfWeek) {
    var Result = 0;
    if (!$impl.IsValidDayOfWeek(DayOfWeek)) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidDayOfWeek"),pas.System.VarRecs(0,DayOfWeek)]);
    Result = $impl.DOWMap[DayOfWeek - 1];
    return Result;
  };
  this.YearOf = function (AValue) {
    var Result = 0;
    var D = 0;
    var M = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }});
    return Result;
  };
  this.MonthOf = function (AValue) {
    var Result = 0;
    var Y = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    return Result;
  };
  this.WeekOf = function (AValue) {
    var Result = 0;
    Result = $mod.WeekOfTheYear(AValue);
    return Result;
  };
  this.DayOf = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.HourOf = function (AValue) {
    var Result = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    return Result;
  };
  this.MinuteOf = function (AValue) {
    var Result = 0;
    var H = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    return Result;
  };
  this.SecondOf = function (AValue) {
    var Result = 0;
    var H = 0;
    var N = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    return Result;
  };
  this.MilliSecondOf = function (AValue) {
    var Result = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.StartOfTheYear = function (AValue) {
    var Result = 0.0;
    Result = pas.SysUtils.EncodeDate($mod.YearOf(AValue),1,1);
    return Result;
  };
  this.EndOfTheYear = function (AValue) {
    var Result = 0.0;
    Result = $mod.EncodeDateTime($mod.YearOf(AValue),12,31,23,59,59,999);
    return Result;
  };
  this.StartOfAYear = function (AYear) {
    var Result = 0.0;
    Result = pas.SysUtils.EncodeDate(AYear,1,1);
    return Result;
  };
  this.EndOfAYear = function (AYear) {
    var Result = 0.0;
    Result = $mod.EncodeDateTime(AYear,12,31,23,59,59,999);
    return Result;
  };
  this.StartOfTheMonth = function (AValue) {
    var Result = 0.0;
    var Y = 0;
    var M = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    Result = pas.SysUtils.EncodeDate(Y,M,1);
    return Result;
  };
  this.EndOfTheMonth = function (AValue) {
    var Result = 0.0;
    var Y = 0;
    var M = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    Result = $mod.EncodeDateTime(Y,M,pas.SysUtils.MonthDays[+pas.SysUtils.IsLeapYear(Y)][M - 1],23,59,59,999);
    return Result;
  };
  this.StartOfAMonth = function (AYear, AMonth) {
    var Result = 0.0;
    Result = pas.SysUtils.EncodeDate(AYear,AMonth,1);
    return Result;
  };
  this.EndOfAMonth = function (AYear, AMonth) {
    var Result = 0.0;
    Result = $mod.EncodeDateTime(AYear,AMonth,pas.SysUtils.MonthDays[+pas.SysUtils.IsLeapYear(AYear)][AMonth - 1],23,59,59,999);
    return Result;
  };
  this.StartOfTheWeek = function (AValue) {
    var Result = 0.0;
    Result = (pas.System.Trunc(AValue) - $mod.DayOfTheWeek(AValue)) + 1;
    return Result;
  };
  this.EndOfTheWeek = function (AValue) {
    var Result = 0.0;
    Result = $mod.EndOfTheDay((AValue - $mod.DayOfTheWeek(AValue)) + 7);
    return Result;
  };
  this.StartOfAWeek = function (AYear, AWeekOfYear, ADayOfWeek) {
    var Result = 0.0;
    Result = $mod.EncodeDateWeek(AYear,AWeekOfYear,ADayOfWeek);
    return Result;
  };
  this.StartOfAWeek$1 = function (AYear, AWeekOfYear) {
    var Result = 0.0;
    Result = $mod.StartOfAWeek(AYear,AWeekOfYear,1);
    return Result;
  };
  this.EndOfAWeek = function (AYear, AWeekOfYear, ADayOfWeek) {
    var Result = 0.0;
    Result = $mod.EndOfTheDay($mod.EncodeDateWeek(AYear,AWeekOfYear,ADayOfWeek));
    return Result;
  };
  this.EndOfAWeek$1 = function (AYear, AWeekOfYear) {
    var Result = 0.0;
    Result = $mod.EndOfAWeek(AYear,AWeekOfYear,7);
    return Result;
  };
  this.StartOfTheDay = function (AValue) {
    var Result = 0.0;
    Result = pas.System.Trunc(AValue);
    return Result;
  };
  this.EndOfTheDay = function (AValue) {
    var Result = 0.0;
    var Y = 0;
    var M = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    Result = $mod.EncodeDateTime(Y,M,D,23,59,59,999);
    return Result;
  };
  this.StartOfADay = function (AYear, AMonth, ADay) {
    var Result = 0.0;
    Result = pas.SysUtils.EncodeDate(AYear,AMonth,ADay);
    return Result;
  };
  this.StartOfADay$1 = function (AYear, ADayOfYear) {
    var Result = 0.0;
    Result = ($mod.StartOfAYear(AYear) + ADayOfYear) - 1;
    return Result;
  };
  this.EndOfADay = function (AYear, AMonth, ADay) {
    var Result = 0.0;
    Result = $mod.EndOfTheDay(pas.SysUtils.EncodeDate(AYear,AMonth,ADay));
    return Result;
  };
  this.EndOfADay$1 = function (AYear, ADayOfYear) {
    var Result = 0.0;
    Result = (($mod.StartOfAYear(AYear) + ADayOfYear) - 1) + pas.SysUtils.EncodeTime(23,59,59,999);
    return Result;
  };
  this.MonthOfTheYear = function (AValue) {
    var Result = 0;
    Result = $mod.MonthOf(AValue);
    return Result;
  };
  this.WeekOfTheYear = function (AValue) {
    var Result = 0;
    var Y = 0;
    var DOW = 0;
    $mod.DecodeDateWeek(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return DOW;
      }, set: function (v) {
        DOW = v;
      }});
    return Result;
  };
  this.WeekOfTheYear$1 = function (AValue, AYear) {
    var Result = 0;
    var DOW = 0;
    $mod.DecodeDateWeek(AValue,AYear,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return DOW;
      }, set: function (v) {
        DOW = v;
      }});
    return Result;
  };
  this.DayOfTheYear = function (AValue) {
    var Result = 0;
    Result = pas.System.Trunc((AValue - $mod.StartOfTheYear(AValue)) + 1);
    return Result;
  };
  this.HourOfTheYear = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = H + (($mod.DayOfTheYear(AValue) - 1) * 24);
    return Result;
  };
  this.MinuteOfTheYear = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = M + ((H + (($mod.DayOfTheYear(AValue) - 1) * 24)) * 60);
    return Result;
  };
  this.SecondOfTheYear = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((M + ((H + (($mod.DayOfTheYear(AValue) - 1) * 24)) * 60)) * 60) + S;
    return Result;
  };
  this.MilliSecondOfTheYear = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((((M + ((H + (($mod.DayOfTheYear(AValue) - 1) * 24)) * 60)) * 60) + S) * 1000) + MS;
    return Result;
  };
  this.WeekOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var DOW = 0;
    $mod.DecodeDateMonthWeek(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return DOW;
      }, set: function (v) {
        DOW = v;
      }});
    return Result;
  };
  this.WeekOfTheMonth$1 = function (AValue, AYear, AMonth) {
    var Result = 0;
    var DOW = 0;
    $mod.DecodeDateMonthWeek(AValue,AYear,AMonth,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},{get: function () {
        return DOW;
      }, set: function (v) {
        DOW = v;
      }});
    return Result;
  };
  this.DayOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.HourOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((D - 1) * 24) + H;
    return Result;
  };
  this.MinuteOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((((D - 1) * 24) + H) * 60) + N;
    return Result;
  };
  this.SecondOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((((((D - 1) * 24) + H) * 60) + N) * 60) + S;
    return Result;
  };
  this.MilliSecondOfTheMonth = function (AValue) {
    var Result = 0;
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = ((((((((D - 1) * 24) + H) * 60) + N) * 60) + S) * 1000) + MS;
    return Result;
  };
  this.DayOfTheWeek = function (AValue) {
    var Result = 0;
    Result = $impl.DOWMap[pas.SysUtils.DayOfWeek(AValue) - 1];
    return Result;
  };
  this.HourOfTheWeek = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (($mod.DayOfTheWeek(AValue) - 1) * 24) + H;
    return Result;
  };
  this.MinuteOfTheWeek = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((($mod.DayOfTheWeek(AValue) - 1) * 24) + H) * 60) + M;
    return Result;
  };
  this.SecondOfTheWeek = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((((($mod.DayOfTheWeek(AValue) - 1) * 24) + H) * 60) + M) * 60) + S;
    return Result;
  };
  this.MilliSecondOfTheWeek = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((((((($mod.DayOfTheWeek(AValue) - 1) * 24) + H) * 60) + M) * 60) + S) * 1000) + MS;
    return Result;
  };
  this.HourOfTheDay = function (AValue) {
    var Result = 0;
    Result = $mod.HourOf(AValue);
    return Result;
  };
  this.MinuteOfTheDay = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (H * 60) + M;
    return Result;
  };
  this.SecondOfTheDay = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((H * 60) + M) * 60) + S;
    return Result;
  };
  this.MilliSecondOfTheDay = function (AValue) {
    var Result = 0;
    var H = 0;
    var M = 0;
    var S = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((((H * 60) + M) * 60) + S) * 1000) + MS;
    return Result;
  };
  this.MinuteOfTheHour = function (AValue) {
    var Result = 0;
    Result = $mod.MinuteOf(AValue);
    return Result;
  };
  this.SecondOfTheHour = function (AValue) {
    var Result = 0;
    var H = 0;
    var S = 0;
    var M = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (M * 60) + S;
    return Result;
  };
  this.MilliSecondOfTheHour = function (AValue) {
    var Result = 0;
    var H = 0;
    var S = 0;
    var M = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (((M * 60) + S) * 1000) + MS;
    return Result;
  };
  this.SecondOfTheMinute = function (AValue) {
    var Result = 0;
    Result = $mod.SecondOf(AValue);
    return Result;
  };
  this.MilliSecondOfTheMinute = function (AValue) {
    var Result = 0;
    var H = 0;
    var S = 0;
    var M = 0;
    var MS = 0;
    pas.SysUtils.DecodeTime(AValue,{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Result = (S * 1000) + MS;
    return Result;
  };
  this.MilliSecondOfTheSecond = function (AValue) {
    var Result = 0;
    Result = $mod.MilliSecondOf(AValue);
    return Result;
  };
  this.WithinPastYears = function (ANow, AThen, AYears) {
    var Result = false;
    Result = $mod.YearsBetween(ANow,AThen,false) <= AYears;
    return Result;
  };
  this.WithinPastMonths = function (ANow, AThen, AMonths) {
    var Result = false;
    Result = $mod.MonthsBetween(ANow,AThen,false) <= AMonths;
    return Result;
  };
  this.WithinPastWeeks = function (ANow, AThen, AWeeks) {
    var Result = false;
    Result = $mod.WeeksBetween(ANow,AThen) <= AWeeks;
    return Result;
  };
  this.WithinPastDays = function (ANow, AThen, ADays) {
    var Result = false;
    Result = $mod.DaysBetween(ANow,AThen) <= ADays;
    return Result;
  };
  this.WithinPastHours = function (ANow, AThen, AHours) {
    var Result = false;
    Result = $mod.HoursBetween(ANow,AThen) <= AHours;
    return Result;
  };
  this.WithinPastMinutes = function (ANow, AThen, AMinutes) {
    var Result = false;
    Result = $mod.MinutesBetween(ANow,AThen) <= AMinutes;
    return Result;
  };
  this.WithinPastSeconds = function (ANow, AThen, ASeconds) {
    var Result = false;
    Result = $mod.SecondsBetween(ANow,AThen) <= ASeconds;
    return Result;
  };
  this.WithinPastMilliSeconds = function (ANow, AThen, AMilliSeconds) {
    var Result = false;
    Result = $mod.MilliSecondsBetween(ANow,AThen) <= AMilliSeconds;
    return Result;
  };
  this.YearsBetween = function (ANow, AThen, AExact) {
    var Result = 0;
    var yy = 0;
    var mm = 0;
    var dd = 0;
    if (AExact && (ANow >= -693594) && (AThen >= -693594) && (ANow <= pas.SysUtils.MaxDateTime) && (AThen <= pas.SysUtils.MaxDateTime)) {
      $mod.PeriodBetween(ANow,AThen,{get: function () {
          return yy;
        }, set: function (v) {
          yy = v;
        }},{get: function () {
          return mm;
        }, set: function (v) {
          mm = v;
        }},{get: function () {
          return dd;
        }, set: function (v) {
          dd = v;
        }});
      Result = yy;
    } else Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) / $mod.ApproxDaysPerYear);
    return Result;
  };
  this.MonthsBetween = function (ANow, AThen, AExact) {
    var Result = 0;
    var y = 0;
    var m = 0;
    var d = 0;
    if (AExact && (ANow >= -693594) && (AThen >= -693594) && (ANow <= pas.SysUtils.MaxDateTime) && (AThen <= pas.SysUtils.MaxDateTime)) {
      $mod.PeriodBetween(ANow,AThen,{get: function () {
          return y;
        }, set: function (v) {
          y = v;
        }},{get: function () {
          return m;
        }, set: function (v) {
          m = v;
        }},{get: function () {
          return d;
        }, set: function (v) {
          d = v;
        }});
      Result = (y * 12) + m;
    } else Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) / $mod.ApproxDaysPerMonth);
    return Result;
  };
  this.WeeksBetween = function (ANow, AThen) {
    var Result = 0;
    Result = rtl.trunc(pas.System.Trunc(Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) / 7);
    return Result;
  };
  this.DaysBetween = function (ANow, AThen) {
    var Result = 0;
    Result = pas.System.Trunc(Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9);
    return Result;
  };
  this.HoursBetween = function (ANow, AThen) {
    var Result = 0;
    Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) * 24);
    return Result;
  };
  this.MinutesBetween = function (ANow, AThen) {
    var Result = 0;
    Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) * 1440);
    return Result;
  };
  this.SecondsBetween = function (ANow, AThen) {
    var Result = 0;
    Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) * 86400);
    return Result;
  };
  this.MilliSecondsBetween = function (ANow, AThen) {
    var Result = 0;
    Result = pas.System.Trunc((Math.abs($impl.DateTimeDiff(ANow,AThen)) + 5.7870370370370369E-9) * 86400000);
    return Result;
  };
  this.PeriodBetween = function (ANow, AThen, Years, months, days) {
    var Y1 = 0;
    var Y2 = 0;
    var M1 = 0;
    var M2 = 0;
    var D1 = 0;
    var D2 = 0;
    if (AThen > ANow) {
      pas.SysUtils.DecodeDate(ANow,{get: function () {
          return Y1;
        }, set: function (v) {
          Y1 = v;
        }},{get: function () {
          return M1;
        }, set: function (v) {
          M1 = v;
        }},{get: function () {
          return D1;
        }, set: function (v) {
          D1 = v;
        }});
      pas.SysUtils.DecodeDate(AThen,{get: function () {
          return Y2;
        }, set: function (v) {
          Y2 = v;
        }},{get: function () {
          return M2;
        }, set: function (v) {
          M2 = v;
        }},{get: function () {
          return D2;
        }, set: function (v) {
          D2 = v;
        }});
    } else {
      pas.SysUtils.DecodeDate(AThen,{get: function () {
          return Y1;
        }, set: function (v) {
          Y1 = v;
        }},{get: function () {
          return M1;
        }, set: function (v) {
          M1 = v;
        }},{get: function () {
          return D1;
        }, set: function (v) {
          D1 = v;
        }});
      pas.SysUtils.DecodeDate(ANow,{get: function () {
          return Y2;
        }, set: function (v) {
          Y2 = v;
        }},{get: function () {
          return M2;
        }, set: function (v) {
          M2 = v;
        }},{get: function () {
          return D2;
        }, set: function (v) {
          D2 = v;
        }});
    };
    Years.set(Y2 - Y1);
    if ((M1 > M2) || ((M1 === M2) && (D1 > D2))) Years.set(Years.get() - 1);
    if (M1 > M2) M2 += 12;
    months.set(M2 - M1);
    if (D2 >= D1) {
      days.set(D2 - D1)}
     else {
      if (months.get() === 0) {
        months.set(11)}
       else months.set(months.get() - 1);
      days.set(($mod.DaysInAMonth(Y1,M1) - D1) + D2);
    };
  };
  this.YearSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) / $mod.ApproxDaysPerYear;
    return Result;
  };
  this.MonthSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) / $mod.ApproxDaysPerMonth;
    return Result;
  };
  this.WeekSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) / 7;
    return Result;
  };
  this.DaySpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen));
    return Result;
  };
  this.HourSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) * 24;
    return Result;
  };
  this.MinuteSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) * 1440;
    return Result;
  };
  this.SecondSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) * 86400;
    return Result;
  };
  this.MilliSecondSpan = function (ANow, AThen) {
    var Result = 0.0;
    Result = Math.abs($impl.DateTimeDiff(ANow,AThen)) * 86400000;
    return Result;
  };
  this.IncYear = function (AValue, ANumberOfYears) {
    var Result = 0.0;
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Y = Y + ANumberOfYears;
    if ((M === 2) && (D === 29) && !pas.SysUtils.IsLeapYear(Y)) D = 28;
    Result = $mod.EncodeDateTime(Y,M,D,H,N,S,MS);
    return Result;
  };
  this.IncYear$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncYear(AValue,1);
    return Result;
  };
  this.IncWeek = function (AValue, ANumberOfWeeks) {
    var Result = 0.0;
    Result = AValue + (ANumberOfWeeks * 7);
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncWeek$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncWeek(AValue,1);
    return Result;
  };
  this.IncDay = function (AValue, ANumberOfDays) {
    var Result = 0.0;
    Result = AValue + ANumberOfDays;
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncDay$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncDay(AValue,1);
    return Result;
  };
  this.IncHour = function (AValue, ANumberOfHours) {
    var Result = 0.0;
    if (AValue >= 0) {
      Result = AValue + (ANumberOfHours / 24)}
     else Result = $impl.IncNegativeTime(AValue,ANumberOfHours / 24);
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncHour$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncHour(AValue,1);
    return Result;
  };
  this.IncMinute = function (AValue, ANumberOfMinutes) {
    var Result = 0.0;
    if (AValue >= 0) {
      Result = AValue + (ANumberOfMinutes / 1440)}
     else Result = $impl.IncNegativeTime(AValue,ANumberOfMinutes / 1440);
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncMinute$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncMinute(AValue,1);
    return Result;
  };
  this.IncSecond = function (AValue, ANumberOfSeconds) {
    var Result = 0.0;
    if (AValue >= 0) {
      Result = AValue + (ANumberOfSeconds / 86400)}
     else Result = $impl.IncNegativeTime(AValue,ANumberOfSeconds / 86400);
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncSecond$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncSecond(AValue,1);
    return Result;
  };
  this.IncMilliSecond = function (AValue, ANumberOfMilliSeconds) {
    var Result = 0.0;
    if (AValue >= 0) {
      Result = AValue + (ANumberOfMilliSeconds / 86400000)}
     else Result = $impl.IncNegativeTime(AValue,ANumberOfMilliSeconds / 86400000);
    $impl.MaybeSkipTimeWarp(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }});
    return Result;
  };
  this.IncMilliSecond$1 = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncMilliSecond(AValue,1);
    return Result;
  };
  this.EncodeDateTime = function (AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond) {
    var Result = 0.0;
    if (!$mod.TryEncodeDateTime(AYear,AMonth,ADay,AHour,AMinute,ASecond,AMilliSecond,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) $mod.InvalidDateTimeError$1(AYear,AMonth,ADay,AHour,AMinute,ASecond,AMilliSecond);
    return Result;
  };
  this.DecodeDateTime = function (AValue, AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond) {
    pas.SysUtils.DecodeTime(AValue,AHour,AMinute,ASecond,AMilliSecond);
    if (AHour.get() === 24) {
      AHour.set(0);
      pas.SysUtils.DecodeDate(Math.round(AValue),AYear,AMonth,ADay);
    } else pas.SysUtils.DecodeDate(AValue,AYear,AMonth,ADay);
  };
  this.TryEncodeDateTime = function (AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond, AValue) {
    var Result = false;
    var tmp = 0.0;
    Result = pas.SysUtils.TryEncodeDate(AYear,AMonth,ADay,AValue);
    Result = Result && pas.SysUtils.TryEncodeTime(AHour,AMinute,ASecond,AMilliSecond,{get: function () {
        return tmp;
      }, set: function (v) {
        tmp = v;
      }});
    if (Result) AValue.set(pas.SysUtils.ComposeDateTime(AValue.get(),tmp));
    return Result;
  };
  this.EncodeDateWeek = function (AYear, AWeekOfYear, ADayOfWeek) {
    var Result = 0.0;
    if (!$mod.TryEncodeDateWeek(AYear,AWeekOfYear,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},ADayOfWeek)) $mod.InvalidDateWeekError(AYear,AWeekOfYear,ADayOfWeek);
    return Result;
  };
  this.EncodeDateWeek$1 = function (AYear, AWeekOfYear) {
    var Result = 0.0;
    Result = $mod.EncodeDateWeek(AYear,AWeekOfYear,1);
    return Result;
  };
  this.DecodeDateWeek = function (AValue, AYear, AWeekOfYear, ADayOfWeek) {
    var DOY = 0;
    var D = 0;
    var YS = 0.0;
    var YSDOW = 0;
    var YEDOW = 0;
    AYear.set($mod.YearOf(AValue));
    ADayOfWeek.set(pas.SysUtils.DayOfWeek(AValue) - 1);
    if (ADayOfWeek.get() === 0) ADayOfWeek.set(7);
    YS = $mod.StartOfAYear(AYear.get());
    DOY = pas.System.Trunc(AValue - YS) + 1;
    YSDOW = $mod.DayOfTheWeek(YS);
    if (YSDOW < 5) {
      DOY += YSDOW - 1}
     else DOY -= 8 - YSDOW;
    if (DOY <= 0) {
      $mod.DecodeDateWeek(YS - 1,AYear,AWeekOfYear,{get: function () {
          return D;
        }, set: function (v) {
          D = v;
        }})}
     else {
      AWeekOfYear.set(rtl.trunc(DOY / 7));
      if ((DOY % 7) !== 0) AWeekOfYear.set(AWeekOfYear.get() + 1);
      if (AWeekOfYear.get() > 52) {
        YEDOW = YSDOW;
        if (pas.SysUtils.IsLeapYear(AYear.get())) {
          YEDOW += 1;
          if (YEDOW > 7) YEDOW = 1;
        };
        if (YEDOW < 4) {
          AYear.set(AYear.get() + 1);
          AWeekOfYear.set(1);
        };
      };
    };
  };
  this.TryEncodeDateWeek = function (AYear, AWeekOfYear, AValue, ADayOfWeek) {
    var Result = false;
    var DOW = 0;
    var Rest = 0;
    Result = $mod.IsValidDateWeek(AYear,AWeekOfYear,ADayOfWeek);
    if (Result) {
      AValue.set(pas.SysUtils.EncodeDate(AYear,1,1) + (7 * (AWeekOfYear - 1)));
      DOW = $mod.DayOfTheWeek(AValue.get());
      Rest = ADayOfWeek - DOW;
      if (DOW > 4) Rest += 7;
      AValue.set(AValue.get() + Rest);
    };
    return Result;
  };
  this.TryEncodeDateWeek$1 = function (AYear, AWeekOfYear, AValue) {
    var Result = false;
    Result = $mod.TryEncodeDateWeek(AYear,AWeekOfYear,AValue,1);
    return Result;
  };
  this.EncodeDateDay = function (AYear, ADayOfYear) {
    var Result = 0.0;
    if (!$mod.TryEncodeDateDay(AYear,ADayOfYear,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) $mod.InvalidDateDayError(AYear,ADayOfYear);
    return Result;
  };
  this.DecodeDateDay = function (AValue, AYear, ADayOfYear) {
    var M = 0;
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,AYear,{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    ADayOfYear.set(pas.System.Trunc(AValue - pas.SysUtils.EncodeDate(AYear.get(),1,1)) + 1);
  };
  this.TryEncodeDateDay = function (AYear, ADayOfYear, AValue) {
    var Result = false;
    Result = (ADayOfYear !== 0) && (ADayOfYear <= $mod.DaysPerYear[+pas.SysUtils.IsLeapYear(AYear)]);
    if (Result) AValue.set((pas.SysUtils.EncodeDate(AYear,1,1) + ADayOfYear) - 1);
    return Result;
  };
  this.EncodeDateMonthWeek = function (AYear, AMonth, AWeekOfMonth, ADayOfWeek) {
    var Result = 0.0;
    if (!$mod.TryEncodeDateMonthWeek(AYear,AMonth,AWeekOfMonth,ADayOfWeek,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) $mod.InvalidDateMonthWeekError(AYear,AMonth,AWeekOfMonth,ADayOfWeek);
    return Result;
  };
  this.DecodeDateMonthWeek = function (AValue, AYear, AMonth, AWeekOfMonth, ADayOfWeek) {
    var D = 0;
    var SDOM = 0;
    var EDOM = 0;
    var SOM = 0.0;
    var DOM = 0;
    pas.SysUtils.DecodeDate(AValue,AYear,AMonth,{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    ADayOfWeek.set($mod.DayOfTheWeek(AValue));
    SOM = pas.SysUtils.EncodeDate(AYear.get(),AMonth.get(),1);
    SDOM = $mod.DayOfTheWeek(SOM);
    DOM = (D - 1) + SDOM;
    if (SDOM > 4) DOM -= 7;
    if (DOM <= 0) {
      $mod.DecodeDateMonthWeek(SOM - 1,AYear,AMonth,AWeekOfMonth,{get: function () {
          return D;
        }, set: function (v) {
          D = v;
        }})}
     else {
      AWeekOfMonth.set(rtl.trunc(DOM / 7));
      if ((DOM % 7) !== 0) AWeekOfMonth.set(AWeekOfMonth.get() + 1);
      EDOM = $mod.DayOfTheWeek($mod.EndOfAMonth(AYear.get(),AMonth.get()));
      if ((EDOM < 4) && (($mod.DaysInAMonth(AYear.get(),AMonth.get()) - D) < EDOM)) {
        AWeekOfMonth.set(1);
        AMonth.set(AMonth.get() + 1);
        if (AMonth.get() === 13) {
          AMonth.set(1);
          AYear.set(AYear.get() + 1);
        };
      };
    };
  };
  this.TryEncodeDateMonthWeek = function (AYear, AMonth, AWeekOfMonth, ADayOfWeek, AValue) {
    var Result = false;
    var S = 0;
    var DOM = 0;
    Result = $mod.IsValidDateMonthWeek(AYear,AMonth,AWeekOfMonth,ADayOfWeek);
    if (Result) {
      AValue.set(pas.SysUtils.EncodeDate(AYear,AMonth,1));
      DOM = (((AWeekOfMonth - 1) * 7) + ADayOfWeek) - 1;
      S = $mod.DayOfTheWeek(AValue.get());
      DOM -= S - 1;
      if ((S === 5) || (S === 6) || (S === 7)) DOM += 7;
      AValue.set(AValue.get() + DOM);
    };
    return Result;
  };
  this.TryEncodeTimeInterval = function (Hour, Min, Sec, MSec, Time) {
    var Result = false;
    Result = (Min < 60) && (Sec < 60) && (MSec < 1000);
    if (Result) Time.set(((Hour * 3600000) + (Min * 60000) + (Sec * 1000) + MSec) / 86400000);
    return Result;
  };
  this.EncodeTimeInterval = function (Hour, Minute, Second, MilliSecond) {
    var Result = 0.0;
    if (!$mod.TryEncodeTimeInterval(Hour,Minute,Second,MilliSecond,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidHourMinuteSecMsec"),pas.System.VarRecs(0,Hour,0,Minute,0,Second,0,MilliSecond)]);
    return Result;
  };
  this.RecodeYear = function (AValue, AYear) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,AYear,65535,65535,65535,65535,65535,65535);
    return Result;
  };
  this.RecodeMonth = function (AValue, AMonth) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,AMonth,65535,65535,65535,65535,65535);
    return Result;
  };
  this.RecodeDay = function (AValue, ADay) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,ADay,65535,65535,65535,65535);
    return Result;
  };
  this.RecodeHour = function (AValue, AHour) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,65535,AHour,65535,65535,65535);
    return Result;
  };
  this.RecodeMinute = function (AValue, AMinute) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,65535,65535,AMinute,65535,65535);
    return Result;
  };
  this.RecodeSecond = function (AValue, ASecond) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,65535,65535,65535,ASecond,65535);
    return Result;
  };
  this.RecodeMilliSecond = function (AValue, AMilliSecond) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,65535,65535,65535,65535,AMilliSecond);
    return Result;
  };
  this.RecodeDate = function (AValue, AYear, AMonth, ADay) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,AYear,AMonth,ADay,65535,65535,65535,65535);
    return Result;
  };
  this.RecodeTime = function (AValue, AHour, AMinute, ASecond, AMilliSecond) {
    var Result = 0.0;
    Result = $mod.RecodeDateTime(AValue,65535,65535,65535,AHour,AMinute,ASecond,AMilliSecond);
    return Result;
  };
  this.RecodeDateTime = function (AValue, AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond) {
    var Result = 0.0;
    if (!$mod.TryRecodeDateTime(AValue,AYear,AMonth,ADay,AHour,AMinute,ASecond,AMilliSecond,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) $mod.InvalidDateTimeError(AYear,AMonth,ADay,AHour,AMinute,ASecond,AMilliSecond,AValue);
    return Result;
  };
  this.TryRecodeDateTime = function (AValue, AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond, AResult) {
    var Result = false;
    function FV(AV, Arg) {
      if (Arg !== 65535) AV.set(Arg);
    };
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    FV({get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},AYear);
    FV({get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},AMonth);
    FV({get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},ADay);
    FV({get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},AHour);
    FV({get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},AMinute);
    FV({get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},ASecond);
    FV({get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }},AMilliSecond);
    Result = $mod.TryEncodeDateTime(Y,M,D,H,N,S,MS,AResult);
    return Result;
  };
  this.CompareDateTime = function (A, B) {
    var Result = 0;
    if ($mod.SameDateTime(A,B)) {
      Result = 0}
     else if (pas.System.Trunc(A) === pas.System.Trunc(B)) {
      if (Math.abs(pas.System.Frac(A)) > Math.abs(pas.System.Frac(B))) {
        Result = 1}
       else Result = -1;
    } else {
      if (A > B) {
        Result = 1}
       else Result = -1;
    };
    return Result;
  };
  this.CompareDate = function (A, B) {
    var Result = 0;
    if ($mod.SameDate(A,B)) {
      Result = 0}
     else if (A < B) {
      Result = -1}
     else Result = 1;
    return Result;
  };
  this.CompareTime = function (A, B) {
    var Result = 0;
    if ($mod.SameTime(A,B)) {
      Result = 0}
     else if (pas.System.Frac(A) < pas.System.Frac(B)) {
      Result = -1}
     else Result = 1;
    return Result;
  };
  this.SameDateTime = function (A, B) {
    var Result = false;
    Result = Math.abs(A - B) < 1.1574074074074074E-8;
    return Result;
  };
  this.SameDate = function (A, B) {
    var Result = false;
    Result = pas.System.Trunc(A) === pas.System.Trunc(B);
    return Result;
  };
  this.SameTime = function (A, B) {
    var Result = false;
    Result = pas.System.Frac(Math.abs(A - B)) < 1.1574074074074074E-8;
    return Result;
  };
  this.NthDayOfWeek = function (AValue) {
    var Result = 0;
    Result = $impl.InternalNthDayOfWeek($mod.DayOfTheMonth(AValue));
    return Result;
  };
  this.DecodeDayOfWeekInMonth = function (AValue, AYear, AMonth, ANthDayOfWeek, ADayOfWeek) {
    var D = 0;
    pas.SysUtils.DecodeDate(AValue,AYear,AMonth,{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }});
    ADayOfWeek.set($mod.DayOfTheWeek(AValue));
    ANthDayOfWeek.set($impl.InternalNthDayOfWeek(D));
  };
  this.EncodeDayOfWeekInMonth = function (AYear, AMonth, ANthDayOfWeek, ADayOfWeek) {
    var Result = 0.0;
    if (!$mod.TryEncodeDayOfWeekInMonth(AYear,AMonth,ANthDayOfWeek,ADayOfWeek,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) $mod.InvalidDayOfWeekInMonthError(AYear,AMonth,ANthDayOfWeek,ADayOfWeek);
    return Result;
  };
  this.TryEncodeDayOfWeekInMonth = function (AYear, AMonth, ANthDayOfWeek, ADayOfWeek, AValue) {
    var Result = false;
    var SOM = 0;
    var D = 0;
    SOM = $mod.DayOfTheWeek(pas.SysUtils.EncodeDate(AYear,AMonth,1));
    D = ((1 + ADayOfWeek) - SOM) + (7 * (ANthDayOfWeek - 1));
    if (SOM > ADayOfWeek) D = D + 7;
    Result = pas.SysUtils.TryEncodeDate(AYear,AMonth,D,AValue);
    return Result;
  };
  this.InvalidDateTimeError = function (AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond, ABaseDate) {
    function DoField(Arg, Def, Unknown) {
      var Result = "";
      if (Def === 0) ;
      if (Arg !== 65535) {
        Result = pas.SysUtils.Format("%.*d",pas.System.VarRecs(19,Unknown.length,0,Arg))}
       else if (ABaseDate === 0) {
        Result = Unknown}
       else Result = pas.SysUtils.Format("%.*d",pas.System.VarRecs(19,Unknown.length,0,Arg));
      return Result;
    };
    var Y = 0;
    var M = 0;
    var D = 0;
    var H = 0;
    var N = 0;
    var S = 0;
    var MS = 0;
    var Msg = "";
    $mod.DecodeDateTime(ABaseDate,{get: function () {
        return Y;
      }, set: function (v) {
        Y = v;
      }},{get: function () {
        return M;
      }, set: function (v) {
        M = v;
      }},{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return H;
      }, set: function (v) {
        H = v;
      }},{get: function () {
        return N;
      }, set: function (v) {
        N = v;
      }},{get: function () {
        return S;
      }, set: function (v) {
        S = v;
      }},{get: function () {
        return MS;
      }, set: function (v) {
        MS = v;
      }});
    Msg = DoField(AYear,Y,"????");
    Msg = Msg + pas.SysUtils.FormatSettings.DateSeparator + DoField(AMonth,M,"??");
    Msg = Msg + pas.SysUtils.FormatSettings.DateSeparator + DoField(ADay,D,"??");
    Msg = Msg + " " + DoField(AHour,H,"??");
    Msg = Msg + pas.SysUtils.FormatSettings.TimeSeparator + DoField(AMinute,N,"??");
    Msg = Msg + pas.SysUtils.FormatSettings.TimeSeparator + DoField(ASecond,S,"??");
    Msg = Msg + pas.SysUtils.FormatSettings.DecimalSeparator + DoField(AMilliSecond,MS,"???");
    throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidTimeStamp"),pas.System.VarRecs(18,Msg)]);
  };
  this.InvalidDateTimeError$1 = function (AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond) {
    $mod.InvalidDateTimeError(AYear,AMonth,ADay,AHour,AMinute,ASecond,AMilliSecond,0);
  };
  this.InvalidDateWeekError = function (AYear, AWeekOfYear, ADayOfWeek) {
    throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidDateWeek"),pas.System.VarRecs(0,AYear,0,AWeekOfYear,0,ADayOfWeek)]);
  };
  this.InvalidDateDayError = function (AYear, ADayOfYear) {
    throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidDayOfYear"),pas.System.VarRecs(0,AYear,0,ADayOfYear)]);
  };
  this.InvalidDateMonthWeekError = function (AYear, AMonth, AWeekOfMonth, ADayOfWeek) {
    throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidDateMonthWeek"),pas.System.VarRecs(0,AYear,0,AMonth,0,AWeekOfMonth,0,ADayOfWeek)]);
  };
  this.InvalidDayOfWeekInMonthError = function (AYear, AMonth, ANthDayOfWeek, ADayOfWeek) {
    throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidDayOfWeekInMonth"),pas.System.VarRecs(0,AYear,0,AMonth,0,ANthDayOfWeek,0,ADayOfWeek)]);
  };
  this.DateTimeToJulianDate = function (AValue) {
    var Result = 0.0;
    var day = 0;
    var month = 0;
    var year = 0;
    var a = 0;
    var y = 0;
    var m = 0;
    pas.SysUtils.DecodeDate(AValue,{get: function () {
        return year;
      }, set: function (v) {
        year = v;
      }},{get: function () {
        return month;
      }, set: function (v) {
        month = v;
      }},{get: function () {
        return day;
      }, set: function (v) {
        day = v;
      }});
    a = rtl.trunc((14 - month) / 12);
    y = (year + 4800) - a;
    m = (month + (12 * a)) - 3;
    Result = ((((day + rtl.trunc(((153 * m) + 2) / 5) + (365 * y) + rtl.trunc(y / 4)) - rtl.trunc(y / 100)) + rtl.trunc(y / 400)) - 32045.5) + pas.System.Frac(AValue);
    return Result;
  };
  this.JulianDateToDateTime = function (AValue) {
    var Result = 0.0;
    if (!$mod.TryJulianDateToDateTime(AValue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SInvalidJulianDate"),pas.System.VarRecs(3,AValue)]);
    return Result;
  };
  this.TryJulianDateToDateTime = function (AValue, ADateTime) {
    var Result = false;
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var e = 0;
    var m = 0;
    var day = 0;
    var month = 0;
    var year = 0;
    a = pas.System.Trunc(AValue + 32044.5);
    b = rtl.trunc(((4 * a) + 3) / 146097);
    c = a - rtl.trunc((146097 * b) / 4);
    d = rtl.trunc(((4 * c) + 3) / 1461);
    e = c - rtl.trunc((1461 * d) / 4);
    m = rtl.trunc(((5 * e) + 2) / 153);
    day = (e - rtl.trunc(((153 * m) + 2) / 5)) + 1;
    month = (m + 3) - (12 * rtl.trunc(m / 10));
    year = (((100 * b) + d) - 4800) + rtl.trunc(m / 10);
    Result = pas.SysUtils.TryEncodeDate(year,month,day,ADateTime);
    if (Result) ADateTime.set(ADateTime.get() + pas.System.Frac(AValue - 0.5));
    return Result;
  };
  this.DateTimeToModifiedJulianDate = function (AValue) {
    var Result = 0.0;
    Result = $mod.DateTimeToJulianDate(AValue) - 2400000.5;
    return Result;
  };
  this.ModifiedJulianDateToDateTime = function (AValue) {
    var Result = 0.0;
    Result = $mod.JulianDateToDateTime(AValue + 2400000.5);
    return Result;
  };
  this.TryModifiedJulianDateToDateTime = function (AValue, ADateTime) {
    var Result = false;
    Result = $mod.TryJulianDateToDateTime(AValue + 2400000.5,ADateTime);
    return Result;
  };
  this.DateTimeToUnix = function (AValue) {
    var Result = 0;
    Result = Math.round($impl.DateTimeDiff($mod.RecodeMilliSecond(AValue,0),25569) * 86400);
    return Result;
  };
  this.UnixToDateTime = function (AValue) {
    var Result = 0.0;
    Result = $mod.IncSecond(25569,AValue);
    return Result;
  };
  var Epoch = 24107 * 24 * 3600;
  this.UnixTimeStampToMac = function (AValue) {
    var Result = 0;
    Result = AValue + 2082844800;
    return Result;
  };
  this.DateTimeToMac = function (AValue) {
    var Result = 0;
    var Epoch = 0.0;
    Epoch = $mod.EncodeDateTime(1904,1,1,0,0,0,0);
    Result = $mod.SecondsBetween(Epoch,AValue);
    return Result;
  };
  this.MacToDateTime = function (AValue) {
    var Result = 0.0;
    var Epoch = 0.0;
    Epoch = $mod.EncodeDateTime(1904,1,1,0,0,0,0);
    Result = $mod.IncSecond(Epoch,AValue);
    return Result;
  };
  var Epoch$1 = 24107 * 24 * 3600;
  this.MacTimeStampToUnix = function (AValue) {
    var Result = 0;
    Result = AValue - 2082844800;
    return Result;
  };
  this.DateTimeToDosDateTime = function (AValue) {
    var Result = 0;
    var year = 0;
    var month = 0;
    var day = 0;
    var hour = 0;
    var min = 0;
    var sec = 0;
    var msec = 0;
    var zs = 0;
    $mod.DecodeDateTime(AValue,{get: function () {
        return year;
      }, set: function (v) {
        year = v;
      }},{get: function () {
        return month;
      }, set: function (v) {
        month = v;
      }},{get: function () {
        return day;
      }, set: function (v) {
        day = v;
      }},{get: function () {
        return hour;
      }, set: function (v) {
        hour = v;
      }},{get: function () {
        return min;
      }, set: function (v) {
        min = v;
      }},{get: function () {
        return sec;
      }, set: function (v) {
        sec = v;
      }},{get: function () {
        return msec;
      }, set: function (v) {
        msec = v;
      }});
    Result = -1980;
    Result = Result + (year & 127);
    Result = Result << 4;
    Result = Result + month;
    Result = Result << 5;
    Result = Result + day;
    Result = Result << 16;
    zs = hour;
    zs = zs << 6;
    zs = zs + min;
    zs = zs << 5;
    zs = zs + rtl.trunc(sec / 2);
    Result = Result + (zs & 0xffff);
    return Result;
  };
  this.DosDateTimeToDateTime = function (AValue) {
    var Result = 0.0;
    var year = 0;
    var month = 0;
    var day = 0;
    var hour = 0;
    var min = 0;
    var sec = 0;
    sec = (AValue & 31) * 2;
    AValue = AValue >>> 5;
    min = AValue & 63;
    AValue = AValue >>> 6;
    hour = AValue & 31;
    AValue = AValue >>> 5;
    day = AValue & 31;
    AValue = AValue >>> 5;
    month = AValue & 15;
    AValue = AValue >>> 4;
    year = AValue + 1980;
    Result = $mod.EncodeDateTime(year,month,day,hour,min,sec,0);
    return Result;
  };
  this.UniversalTimeToLocal = function (UT) {
    var Result = 0.0;
    Result = $mod.UniversalTimeToLocal$1(UT,-pas.SysUtils.GetLocalTimeOffset());
    return Result;
  };
  this.UniversalTimeToLocal$1 = function (UT, TZOffset) {
    var Result = 0.0;
    if (TZOffset > 0) {
      Result = UT + pas.SysUtils.EncodeTime(rtl.trunc(TZOffset / 60),TZOffset % 60,0,0)}
     else if (TZOffset < 0) {
      Result = UT - pas.SysUtils.EncodeTime(rtl.trunc(Math.abs(TZOffset) / 60),Math.abs(TZOffset) % 60,0,0)}
     else Result = UT;
    return Result;
  };
  this.LocalTimeToUniversal = function (LT) {
    var Result = 0.0;
    Result = $mod.LocalTimeToUniversal$1(LT,-pas.SysUtils.GetLocalTimeOffset());
    return Result;
  };
  this.LocalTimeToUniversal$1 = function (LT, TZOffset) {
    var Result = 0.0;
    if (TZOffset > 0) {
      Result = LT - pas.SysUtils.EncodeTime(rtl.trunc(TZOffset / 60),TZOffset % 60,0,0)}
     else if (TZOffset < 0) {
      Result = LT + pas.SysUtils.EncodeTime(rtl.trunc(Math.abs(TZOffset) / 60),Math.abs(TZOffset) % 60,0,0)}
     else Result = LT;
    return Result;
  };
  this.DateTimeToRFC3339 = function (ADate) {
    var Result = "";
    Result = pas.SysUtils.FormatDateTime('yyyy-mm-dd"T"hh":"nn":"ss"."zzz"Z"',ADate);
    return Result;
  };
  this.DateToRFC3339 = function (ADate) {
    var Result = "";
    Result = pas.SysUtils.FormatDateTime("yyyy-mm-dd",ADate);
    return Result;
  };
  this.TimeToRFC3339 = function (ADate) {
    var Result = "";
    Result = pas.SysUtils.FormatDateTime('hh":"nn":"ss"."zzz',ADate);
    return Result;
  };
  var TPartPos = {"0": "ppTime", ppTime: 0, "1": "ppYear", ppYear: 1, "2": "ppMonth", ppMonth: 2, "3": "ppDay", ppDay: 3, "4": "ppHour", ppHour: 4, "5": "ppMinute", ppMinute: 5, "6": "ppSec", ppSec: 6, "7": "ppMSec", ppMSec: 7};
  var P = [11,1,6,9,12,15,18,21];
  this.TryRFC3339ToDateTime = function (Avalue, ADateTime) {
    var Result = false;
    var lY = 0;
    var lM = 0;
    var lD = 0;
    var lH = 0;
    var lMi = 0;
    var lS = 0;
    var lMs = 0;
    if (pas.SysUtils.Trim(Avalue) === "") {
      Result = true;
      ADateTime.set(0);
    };
    lY = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppYear],4),-1);
    lM = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppMonth],2),-1);
    lD = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppDay],2),-1);
    if (Avalue.length >= P[TPartPos.ppTime]) {
      lH = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppHour],2),-1);
      lMi = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppMinute],2),-1);
      if (Avalue.length >= P[TPartPos.ppSec]) {
        lS = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppSec],2),-1)}
       else lS = 0;
      if (Avalue.length >= P[TPartPos.ppMSec]) lMs = pas.SysUtils.StrToIntDef(pas.System.Copy(Avalue,P[TPartPos.ppMSec],3),-1);
    } else {
      lH = 0;
      lMi = 0;
      lS = 0;
      lMs = 0;
    };
    Result = (lY >= 0) && (lM >= 0) && (lD >= 0) && (lH >= 0) && (lMi >= 0) && (lS >= 0) && (lMs >= 0);
    if (!Result) {
      ADateTime.set(0)}
     else if ((lY === 0) || (lM === 0) || (lD === 0)) {
      ADateTime.set(pas.SysUtils.EncodeTime(lH,lMi,lS,0))}
     else ADateTime.set(pas.SysUtils.EncodeDate(lY,lM,lD) + pas.SysUtils.EncodeTime(lH,lMi,lS,lMs));
    return Result;
  };
  this.RFC3339ToDateTime = function (Avalue) {
    var Result = 0.0;
    if (!$mod.TryRFC3339ToDateTime(Avalue,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) Result = 0;
    return Result;
  };
  var FmtOffset = "%.02d:%.02d";
  var Sign = ["+","-"];
  this.DateToISO8601 = function (ADate, AInputIsUTC) {
    var Result = "";
    var Offset = 0;
    Result = pas.SysUtils.FormatDateTime($impl.FmtUTC,ADate);
    Offset = pas.SysUtils.GetLocalTimeOffset$2(ADate,AInputIsUTC);
    if (AInputIsUTC || (Offset === 0)) {
      Result = Result + "Z"}
     else {
      Result = Result + Sign[+(Offset > 0)];
      Offset = Math.abs(Offset);
      Result = Result + pas.SysUtils.Format(FmtOffset,pas.System.VarRecs(0,rtl.trunc(Offset / 60),0,Offset % 60));
    };
    return Result;
  };
  this.ISO8601ToDate = function (DateString, ReturnUTC) {
    var Result = 0.0;
    if (!$mod.TryISO8601ToDate(DateString,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},ReturnUTC)) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidTimeStamp"),pas.System.VarRecs(18,DateString)]);
    return Result;
  };
  this.ISO8601ToDateDef = function (DateString, ReturnUTC, aDefault) {
    var Result = 0.0;
    if (!$mod.TryISO8601ToDate(DateString,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},ReturnUTC)) Result = aDefault;
    return Result;
  };
  this.ISO8601ToDateDef$1 = function (DateString, aDefault, ReturnUTC) {
    var Result = 0.0;
    if (!$mod.TryISO8601ToDate(DateString,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},ReturnUTC)) Result = aDefault;
    return Result;
  };
  this.TryISO8601ToDate = function (DateString, ADateTime, ReturnUTC) {
    var Result = false;
    var S = "";
    var TZ = "";
    var L = 0;
    var Offset = 0;
    var TZOffset = 0;
    S = DateString;
    L = S.length;
    if (L === 0) return false;
    if (S.charAt(L - 1) === "Z") {
      TZ = "Z";
      S = pas.System.Copy(S,1,L - 1);
    } else if (((L > 11) && ((S.charCodeAt(10) in rtl.createSet(84,32)) || (S.charCodeAt(8) in rtl.createSet(84,32)))) || (S.charAt(0) === "T")) {
      if (S.charCodeAt(L - 2 - 1) in rtl.createSet(43,45)) {
        TZ = pas.System.Copy(S,L - 2,3);
        S = pas.System.Copy(S,1,L - 3);
      } else if (S.charCodeAt(L - 4 - 1) in rtl.createSet(43,45)) {
        TZ = pas.System.Copy(S,L - 4,5);
        S = pas.System.Copy(S,1,L - 5);
      } else if ((S.charCodeAt(L - 5 - 1) in rtl.createSet(43,45)) && ((L > 13) || (S.charAt(0) === "T"))) {
        TZ = pas.System.Copy(S,L - 5,6);
        S = pas.System.Copy(S,1,L - 6);
      };
    };
    Result = $impl.TryISOStrToDateTime(S,ADateTime) && $impl.TryISOTZStrToTZOffset(TZ,{get: function () {
        return TZOffset;
      }, set: function (v) {
        TZOffset = v;
      }});
    if (!Result) return Result;
    ADateTime.set($mod.IncMinute(ADateTime.get(),TZOffset));
    if (ReturnUTC) {
      Offset = 0}
     else Offset = -pas.SysUtils.GetLocalTimeOffset$2(ADateTime.get(),true);
    ADateTime.set($mod.IncMinute(ADateTime.get(),Offset));
    Result = true;
    return Result;
  };
  rtl.createClass(this,"TDateTimeScanner",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FPattern = "";
      this.FText = "";
      this.FPatternOffset = 0;
      this.FLen = 0;
      this.FPatternLen = 0;
      this.FPatternPos = 0;
      this.FPos = 0;
      this.FY = 0;
      this.FM = 0;
      this.FD = 0;
      this.FTimeval = 0.0;
    };
    this.ArrayMatchError = function () {
      $impl.raiseexception(pas.SysUtils.Format($impl.SNoArrayMatch,pas.System.VarRecs(0,this.FPatternPos + 1,0,this.FPos)));
    };
    this.DoDateTime = function () {
      this.MatchPattern(pas.SysUtils.FormatSettings.ShortDateFormat);
      this.MatchPattern("\t");
      this.MatchPattern(pas.SysUtils.FormatSettings.LongTimeFormat);
      this.FPatternPos += 1;
    };
    this.SetPattern = function (AValue) {
      if (this.FPattern === AValue) return;
      this.FPattern = AValue;
      this.FPatternLen = this.FPattern.length;
    };
    this.SetText = function (AValue) {
      if (this.FText === AValue) return;
      this.FText = AValue;
      this.FLen = this.FText.length;
    };
    this.ScanFixedInt = function (maxv) {
      var Result = 0;
      var c = "\x00";
      var n = "\x00";
      var oi = 0;
      Result = 0;
      oi = this.FPos;
      c = this.FPattern.charAt(this.FPatternPos - 1);
      while ((this.FPatternPos <= this.FPatternLen) && (this.FPattern.charAt(this.FPatternPos - 1) === c)) this.FPatternPos += 1;
      n = this.FText.charAt(this.FPos - 1);
      while ((maxv > 0) && (this.FPos <= this.FLen) && (n.charCodeAt() in rtl.createSet(null,48,57))) {
        Result = ((Result * 10) + n.charCodeAt()) - 48;
        this.FPos += 1;
        maxv -= 1;
        if (this.FPos <= this.FLen) n = this.FText.charAt(this.FPos - 1);
      };
      if (oi === this.FPos) $impl.raiseexception(pas.SysUtils.Format($impl.SPatternCharMismatch,pas.System.VarRecs(9,c,0,oi)));
      return Result;
    };
    this.ScanPatternLength = function () {
      var Result = 0;
      var c = "\x00";
      var i = 0;
      Result = this.FPatternPos;
      i = this.FPatternPos;
      c = this.FPattern.charAt(i - 1);
      while ((i <= this.FPatternLen) && (this.FPattern.charAt(i - 1) === c)) i += 1;
      Result = i - Result;
      return Result;
    };
    this.MatchChar = function (c) {
      var N = "\x00";
      if (this.FPos <= this.FLen) {
        N = this.FText.charAt(this.FPos - 1)}
       else N = "?";
      if (N !== c) $impl.raiseexception(pas.SysUtils.Format($impl.SNoCharMatch,pas.System.VarRecs(9,N,9,c,0,this.FPatternPos + this.FPatternOffset,0,this.FPos)));
      this.FPatternPos += 1;
      this.FPos += 1;
    };
    this.FindIMatch = function (values, aTerm) {
      var Result = 0;
      var l = 0;
      var i = 0;
      Result = -1;
      l = rtl.length(values) - 1;
      i = 0;
      while ((i <= l) && (Result === -1)) {
        if (pas.SysUtils.SameText(pas.System.Copy(aTerm,1,values[i].length),values[i])) Result = i;
        i += 1;
      };
      return Result;
    };
    this.FindMatch = function (Values) {
      var Result = 0;
      Result = this.FindIMatch(Values,pas.System.Copy(this.FText,this.FPos,(this.FLen - this.FPos) + 1));
      if (Result === -1) {
        this.ArrayMatchError()}
       else {
        this.FPos += Values[Result].length + 1;
        this.FPatternPos += Values[Result].length + 1;
        Result += 1;
      };
      return Result;
    };
    this.MatchPattern = function (aPattern) {
      var T = "";
      var cPos = 0;
      T = this.FPattern;
      cPos = this.FPatternPos;
      this.FPatternOffset = this.FPatternPos;
      this.FPattern = aPattern;
      this.FPatternLen = aPattern.length;
      try {
        this.Scan(-1);
      } finally {
        this.FPattern = T;
        this.FPatternLen = aPattern.length;
        this.FPatternPos = cPos;
        this.FPatternOffset = 0;
      };
    };
    this.DoYear = function () {
      var I = 0;
      var pivot = 0;
      I = this.ScanPatternLength();
      this.FY = this.ScanFixedInt(4);
      if (I <= 2) {
        pivot = $mod.YearOf(pas.SysUtils.Now()) - pas.SysUtils.TwoDigitYearCenturyWindow;
        this.FY += rtl.trunc(pivot / 100) * 100;
        if ((pas.SysUtils.TwoDigitYearCenturyWindow > 0) && (this.FY < pivot)) this.FY += 100;
      };
    };
    this.DoMonth = function () {
      var I = 0;
      I = this.ScanPatternLength();
      var $tmp = I;
      if (($tmp === 1) || ($tmp === 2)) {
        this.FM = this.ScanFixedInt(2)}
       else if ($tmp === 3) {
        this.FM = this.FindMatch(pas.SysUtils.FormatSettings.ShortMonthNames)}
       else if ($tmp === 4) this.FM = this.FindMatch(pas.SysUtils.FormatSettings.LongMonthNames);
    };
    this.DoDay = function () {
      var I = 0;
      I = this.ScanPatternLength();
      var $tmp = I;
      if (($tmp === 1) || ($tmp === 2)) {
        this.FD = this.ScanFixedInt(2)}
       else if ($tmp === 3) {
        this.FD = this.FindMatch(pas.SysUtils.FormatSettings.ShortDayNames)}
       else if ($tmp === 4) {
        this.FD = this.FindMatch(pas.SysUtils.FormatSettings.LongDayNames)}
       else if ($tmp === 5) {
        this.MatchPattern(pas.SysUtils.FormatSettings.ShortDateFormat)}
       else if ($tmp === 6) this.MatchPattern(pas.SysUtils.FormatSettings.LongDateFormat);
    };
    this.DoTime = function () {
      var I = 0;
      I = this.ScanPatternLength();
      var $tmp = I;
      if ($tmp === 1) {
        this.MatchPattern(pas.SysUtils.FormatSettings.ShortTimeFormat)}
       else if ($tmp === 2) this.MatchPattern(pas.SysUtils.FormatSettings.LongTimeFormat);
    };
    this.DoAMPM = function () {
      var I = 0;
      I = this.FindIMatch($impl.AMPMformatting,pas.System.Copy(this.FPattern,this.FPatternPos,5));
      var $tmp = I;
      if ($tmp === 0) {
        I = this.FindIMatch(["AM","PM"],pas.System.Copy(this.FText,this.FPos,2));
        var $tmp1 = I;
        if ($tmp1 === 0) {}
        else if ($tmp1 === 1) {
          this.FTimeval = this.FTimeval + (12 * 0.041666666666666664)}
         else {
          this.ArrayMatchError();
        };
        this.FPatternPos += $impl.AMPMformatting[0].length;
        this.FPos += 2;
      } else if ($tmp === 1) {
        var $tmp2 = pas.System.upcase(this.FText.charAt(this.FPos - 1));
        if ($tmp2 === "A") {}
        else if ($tmp2 === "P") {
          this.FTimeval = this.FTimeval + (12 * 0.041666666666666664)}
         else {
          this.ArrayMatchError();
        };
        this.FPatternPos += $impl.AMPMformatting[1].length;
        this.FPos += 1;
      } else if ($tmp === 2) {
        I = this.FindIMatch([pas.SysUtils.FormatSettings.TimeAMString,pas.SysUtils.FormatSettings.TimePMString],pas.System.Copy(this.FText,this.FPos,5));
        var $tmp3 = I;
        if ($tmp3 === 0) {
          this.FPos += pas.SysUtils.FormatSettings.TimeAMString.length}
         else if ($tmp3 === 1) {
          this.FTimeval = this.FTimeval + (12 * 0.041666666666666664);
          this.FPos += pas.SysUtils.FormatSettings.TimePMString.length;
        } else {
          this.ArrayMatchError();
        };
        this.FPatternPos += $impl.AMPMformatting[2].length;
        this.FPatternPos += 2;
        this.FPos += 2;
      } else {
        this.MatchChar(this.FPattern.charAt(this.FPatternPos - 1));
      };
    };
    this.Scan = function (StartPos) {
      var Result = 0.0;
      var lasttoken = "\x00";
      var activequote = "\x00";
      var lch = "\x00";
      var i = 0;
      if (StartPos < 1) StartPos = 1;
      if (this.FPos < StartPos) this.FPos = StartPos;
      this.FPatternPos = 1;
      activequote = "\x00";
      lasttoken = " ";
      while ((this.FPos <= this.FLen) && (this.FPatternPos <= this.FPatternLen)) {
        lch = pas.System.upcase(this.FPattern.charAt(this.FPatternPos - 1));
        if (activequote !== "\x00") {
          if (activequote !== lch) {
            this.MatchChar(lch)}
           else {
            activequote = "\x00";
            this.FPatternPos += 1;
          };
        } else {
          if ((lch === "M") && (lasttoken === "H")) {
            i = this.ScanPatternLength();
            if (i > 2) $impl.raiseexception(pas.SysUtils.Format($impl.SHHMMError,pas.System.VarRecs(0,this.FPatternOffset + this.FPatternPos + 1)));
            this.FTimeval = this.FTimeval + (this.ScanFixedInt(2) * 6.9444444444444447E-4);
          } else {
            var $tmp = lch;
            if ($tmp === "Y") {
              this.DoYear()}
             else if ($tmp === "M") {
              this.DoMonth()}
             else if ($tmp === "D") {
              this.DoDay()}
             else if ($tmp === "T") {
              this.DoTime()}
             else if ($tmp === "H") {
              this.FTimeval = this.FTimeval + (this.ScanFixedInt(2) * 0.041666666666666664)}
             else if ($tmp === "N") {
              this.FTimeval = this.FTimeval + (this.ScanFixedInt(2) * 6.9444444444444447E-4)}
             else if ($tmp === "S") {
              this.FTimeval = this.FTimeval + (this.ScanFixedInt(2) * 1.1574074074074073E-5)}
             else if ($tmp === "Z") {
              this.FTimeval = this.FTimeval + (this.ScanFixedInt(3) * 1.1574074074074074E-8)}
             else if ($tmp === "A") {
              this.DoAMPM()}
             else if ($tmp === "/") {
              this.MatchChar(pas.SysUtils.FormatSettings.DateSeparator)}
             else if ($tmp === ":") {
              this.MatchChar(pas.SysUtils.FormatSettings.TimeSeparator);
              lch = lasttoken;
            } else if (($tmp === "'") || ($tmp === '"')) {
              activequote = lch;
              this.FPatternPos += 1;
            } else if ($tmp === "C") {
              this.DoDateTime()}
             else if ($tmp === "?") {
              this.FPatternPos += 1;
              this.FPos += 1;
            } else if ($tmp === "\t") {
              while ((this.FPos <= this.FLen) && (this.FText.charCodeAt(this.FPos - 1) in $impl.whitespace)) this.FPos += 1;
              this.FPatternPos += 1;
            } else {
              this.MatchChar(this.FPattern.charAt(this.FPatternPos - 1));
            };
          };
          lasttoken = lch;
        };
      };
      Result = this.FTimeval;
      if ((this.FY > 0) && (this.FM > 0) && (this.FD > 0)) Result = Result + pas.SysUtils.EncodeDate(this.FY,this.FM,this.FD);
      return Result;
    };
  });
  this.ScanDateTime = function (APattern, AValue, APos) {
    var Result = 0.0;
    var T = null;
    T = $mod.TDateTimeScanner.$create("Create");
    try {
      T.SetPattern(APattern);
      T.SetText(AValue);
      Result = T.Scan(APos);
    } finally {
      T = rtl.freeLoc(T);
    };
    return Result;
  };
  $mod.$implcode = function () {
    $impl.TDateTimeEpsilon = 2.2204460493e-16;
    $impl.HalfMilliSecond = 1.1574074074074074E-8 / 2;
    $impl.IsValidMonth = function (AMonth) {
      var Result = false;
      Result = (AMonth >= 1) && (AMonth <= 12);
      return Result;
    };
    $impl.IsValidDayOfWeek = function (ADayOfWeek) {
      var Result = false;
      Result = (ADayOfWeek >= 1) && (ADayOfWeek <= 7);
      return Result;
    };
    $impl.IsValidWeekOfMonth = function (AWeekOfMonth) {
      var Result = false;
      Result = (AWeekOfMonth >= 1) && (AWeekOfMonth <= 5);
      return Result;
    };
    $mod.$rtti.$StaticArray("DOWMap$a",{dims: [7], eltype: rtl.word});
    $impl.DOWMap = [7,1,2,3,4,5,6];
    $impl.DateTimeDiff = function (ANow, AThen) {
      var Result = 0.0;
      Result = ANow - AThen;
      if ((ANow > 0) && (AThen < 0)) {
        Result = Result - 0.5}
       else if ((ANow < -1.0) && (AThen > -1.0)) Result = Result + 0.5;
      return Result;
    };
    $impl.MaybeSkipTimeWarp = function (OldDate, NewDate) {
      if ((OldDate >= 0) && (NewDate.get() < -2.2204460493E-16)) {
        NewDate.set(pas.System.Int((NewDate.get() - 1.0) + 2.2204460493E-16) - pas.System.Frac(1.0 + pas.System.Frac(NewDate.get())))}
       else if ((OldDate <= -1.0) && (NewDate.get() > (-1.0 + 2.2204460493E-16))) NewDate.set(pas.System.Int((NewDate.get() + 1.0) - 2.2204460493E-16) + pas.System.Frac(1.0 - Math.abs(pas.System.Frac(1.0 + NewDate.get()))));
    };
    $impl.IncNegativeTime = function (AValue, Addend) {
      var Result = 0.0;
      var newtime = 0.0;
      newtime = -pas.System.Frac(AValue) + pas.System.Frac(Addend);
      if (pas.Math.SameValue(newtime,pas.System.Int(newtime) + 1,2.2204460493E-16)) {
        newtime = pas.System.Int(newtime) + 1}
       else if (pas.Math.SameValue(newtime,pas.System.Int(newtime),2.2204460493E-16)) newtime = pas.System.Int(newtime);
      if (newtime < -2.2204460493E-16) {
        newtime = 1.0 + newtime;
        AValue = pas.System.Int(AValue) - 1;
      } else if (newtime >= (1.0 - 2.2204460493E-16)) {
        newtime = newtime - 1.0;
        AValue = pas.System.Int(AValue) + 1;
      };
      Result = (pas.System.Int(AValue) + pas.System.Int(Addend)) - newtime;
      return Result;
    };
    $impl.LFAI = 65535;
    $impl.InternalNthDayOfWeek = function (DoM) {
      var Result = 0;
      Result = rtl.trunc((DoM - 1) / 7) + 1;
      return Result;
    };
    $impl.whitespace = rtl.createSet(32,13,10);
    $impl.hrfactor = 1 / 24;
    $impl.minfactor = 1 / (24 * 60);
    $impl.secfactor = 1 / (24 * 60 * 60);
    $impl.mssecfactor = 1 / (24 * 60 * 60 * 1000);
    $mod.$rtti.$StaticArray("AMPMformatting$a",{dims: [3], eltype: rtl.string});
    $impl.AMPMformatting = ["am/pm","a/p","ampm"];
    $impl.raiseexception = function (s) {
      throw pas.SysUtils.EConvertError.$create("Create$1",[s]);
    };
    $impl.FmtUTC = 'yyyy"-"mm"-"dd"T"hh":"nn":"ss"."zzz';
    $impl.TryISOStrToDate = function (aString, outDate) {
      var Result = false;
      var xYear = 0;
      var xMonth = 0;
      var xDay = 0;
      var $tmp = aString.length;
      if ($tmp === 4) {
        Result = pas.SysUtils.TryStrToInt(aString,{get: function () {
            return xYear;
          }, set: function (v) {
            xYear = v;
          }}) && pas.SysUtils.TryEncodeDate(xYear,1,1,outDate)}
       else if ($tmp === 6) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,4),{get: function () {
            return xYear;
          }, set: function (v) {
            xYear = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,5,2),{get: function () {
            return xMonth;
          }, set: function (v) {
            xMonth = v;
          }}) && pas.SysUtils.TryEncodeDate(xYear,xMonth,1,outDate)}
       else if ($tmp === 7) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,4),{get: function () {
            return xYear;
          }, set: function (v) {
            xYear = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,6,2),{get: function () {
            return xMonth;
          }, set: function (v) {
            xMonth = v;
          }}) && pas.SysUtils.TryEncodeDate(xYear,xMonth,1,outDate)}
       else if ($tmp === 8) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,4),{get: function () {
            return xYear;
          }, set: function (v) {
            xYear = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,5,2),{get: function () {
            return xMonth;
          }, set: function (v) {
            xMonth = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,7,2),{get: function () {
            return xDay;
          }, set: function (v) {
            xDay = v;
          }}) && pas.SysUtils.TryEncodeDate(xYear,xMonth,xDay,outDate)}
       else if ($tmp === 10) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,4),{get: function () {
            return xYear;
          }, set: function (v) {
            xYear = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,6,2),{get: function () {
            return xMonth;
          }, set: function (v) {
            xMonth = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,9,2),{get: function () {
            return xDay;
          }, set: function (v) {
            xDay = v;
          }}) && pas.SysUtils.TryEncodeDate(xYear,xMonth,xDay,outDate)}
       else {
        Result = false;
      };
      if (!Result) outDate.set(0);
      return Result;
    };
    $impl.TryISOStrToTime = function (aString, outTime) {
      var Result = false;
      var xHour = 0;
      var xMinute = 0;
      var xSecond = 0;
      var xLength = 0;
      var res = 0;
      var xFractionalSecond = 0.0;
      var tmp = "";
      Result = true;
      xLength = aString.length;
      if ((xLength > 0) && (aString.charAt(xLength - 1) === "Z")) {
        xLength -= 1;
      } else if ((xLength > 6) && pas.SysUtils.CharInSet(aString.charAt(xLength - 5 - 1),["+","-"])) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,xLength - 4,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && (aString.charAt(xLength - 2 - 1) === ":") && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,xLength - 1,2),{get: function () {
            return xMinute;
          }, set: function (v) {
            xMinute = v;
          }});
        xLength -= 6;
      } else if ((xLength > 5) && pas.SysUtils.CharInSet(aString.charAt(xLength - 4 - 1),["+","-"])) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,xLength - 3,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,xLength - 1,2),{get: function () {
            return xMinute;
          }, set: function (v) {
            xMinute = v;
          }});
        xLength -= 5;
      } else if ((xLength > 3) && pas.SysUtils.CharInSet(aString.charAt(xLength - 2 - 1),["+","-"])) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,xLength - 1,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }});
        xLength -= 3;
      };
      if (!Result) {
        outTime.set(0);
        return Result;
      };
      var $tmp = xLength;
      if ($tmp === 2) {
        Result = pas.SysUtils.TryStrToInt(aString,{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && pas.SysUtils.TryEncodeTime(xHour,0,0,0,outTime)}
       else if ($tmp === 4) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,3,2),{get: function () {
            return xMinute;
          }, set: function (v) {
            xMinute = v;
          }}) && pas.SysUtils.TryEncodeTime(xHour,xMinute,0,0,outTime)}
       else if ($tmp === 5) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && (aString.charAt(2) === ":") && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,4,2),{get: function () {
            return xMinute;
          }, set: function (v) {
            xMinute = v;
          }}) && pas.SysUtils.TryEncodeTime(xHour,xMinute,0,0,outTime)}
       else if ($tmp === 6) {
        Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,2),{get: function () {
            return xHour;
          }, set: function (v) {
            xHour = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,3,2),{get: function () {
            return xMinute;
          }, set: function (v) {
            xMinute = v;
          }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,5,2),{get: function () {
            return xSecond;
          }, set: function (v) {
            xSecond = v;
          }}) && pas.SysUtils.TryEncodeTime(xHour,xMinute,xSecond,0,outTime)}
       else {
        if ((xLength >= 8) && (aString.charAt(2) === ":") && (aString.charAt(5) === ":")) {
          Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,2),{get: function () {
              return xHour;
            }, set: function (v) {
              xHour = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,4,2),{get: function () {
              return xMinute;
            }, set: function (v) {
              xMinute = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,7,2),{get: function () {
              return xSecond;
            }, set: function (v) {
              xSecond = v;
            }}) && pas.SysUtils.TryEncodeTime(xHour,xMinute,xSecond,0,outTime);
          if (Result && (xLength >= 9)) {
            tmp = pas.System.Copy(aString,10,xLength - 9);
            pas.System.val$8("." + tmp,{get: function () {
                return xFractionalSecond;
              }, set: function (v) {
                xFractionalSecond = v;
              }},{get: function () {
                return res;
              }, set: function (v) {
                res = v;
              }});
            Result = res === 0;
            if (Result) outTime.set(outTime.get() + (xFractionalSecond * 1.1574074074074073E-5));
          };
        } else if ((xLength >= 7) && (aString.charCodeAt(6) in rtl.createSet(46,44))) {
          Result = pas.SysUtils.TryStrToInt(pas.System.Copy(aString,1,2),{get: function () {
              return xHour;
            }, set: function (v) {
              xHour = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,3,2),{get: function () {
              return xMinute;
            }, set: function (v) {
              xMinute = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(aString,5,2),{get: function () {
              return xSecond;
            }, set: function (v) {
              xSecond = v;
            }}) && pas.SysUtils.TryEncodeTime(xHour,xMinute,xSecond,0,outTime);
          tmp = pas.System.Copy(aString,8,xLength - 7);
          if (Result && (tmp !== "")) {
            pas.System.val$8("." + tmp,{get: function () {
                return xFractionalSecond;
              }, set: function (v) {
                xFractionalSecond = v;
              }},{get: function () {
                return res;
              }, set: function (v) {
                res = v;
              }});
            Result = res === 0;
            if (Result) outTime.set(outTime.get() + (xFractionalSecond * 1.1574074074074073E-5));
          };
        } else Result = false;
      };
      if (!Result) outTime.set(0);
      return Result;
    };
    $impl.TryISOStrToDateTime = function (aString, outDateTime) {
      var Result = false;
      var xLength = 0;
      var sDate = "";
      var sTime = "";
      var xDate = 0.0;
      var xTime = 0.0;
      xLength = aString.length;
      if (xLength === 0) return false;
      if (aString.charAt(0) === "T") {
        Result = $impl.TryISOStrToTime(pas.System.Copy(aString,2,aString.length - 1),outDateTime);
        return Result;
      };
      if (xLength in rtl.createSet(4,7,8,10)) {
        Result = $impl.TryISOStrToDate(aString,outDateTime);
        return Result;
      };
      if ((xLength > 11) && pas.SysUtils.CharInSet(aString.charAt(10),[" ","T"])) {
        sDate = pas.System.Copy(aString,1,10);
        sTime = pas.System.Copy(aString,12,aString.length);
      } else if ((xLength > 9) && pas.SysUtils.CharInSet(aString.charAt(8),[" ","T"])) {
        sDate = pas.System.Copy(aString,1,8);
        sTime = pas.System.Copy(aString,10,aString.length);
      } else return false;
      Result = $impl.TryISOStrToDate(sDate,{get: function () {
          return xDate;
        }, set: function (v) {
          xDate = v;
        }}) && $impl.TryISOStrToTime(sTime,{get: function () {
          return xTime;
        }, set: function (v) {
          xTime = v;
        }});
      if (Result) {
        outDateTime.set(xDate + xTime)}
       else outDateTime.set(0);
      return Result;
    };
    $impl.TryISOTZStrToTZOffset = function (TZ, TZOffset) {
      var Result = false;
      var H = 0;
      var M = 0;
      Result = (TZ === "Z") || (TZ === "");
      if (Result) {
        TZOffset.set(0)}
       else {
        Result = TZ.charCodeAt(0) in rtl.createSet(43,45);
        if (!Result) return Result;
        var $tmp = TZ.length;
        if ($tmp === 3) {
          Result = pas.SysUtils.TryStrToInt(pas.System.Copy(TZ,2,2),{get: function () {
              return H;
            }, set: function (v) {
              H = v;
            }});
          M = 0;
        } else if ($tmp === 5) {
          Result = pas.SysUtils.TryStrToInt(pas.System.Copy(TZ,2,2),{get: function () {
              return H;
            }, set: function (v) {
              H = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(TZ,4,2),{get: function () {
              return M;
            }, set: function (v) {
              M = v;
            }})}
         else if ($tmp === 6) {
          Result = pas.SysUtils.TryStrToInt(pas.System.Copy(TZ,2,2),{get: function () {
              return H;
            }, set: function (v) {
              H = v;
            }}) && pas.SysUtils.TryStrToInt(pas.System.Copy(TZ,5,2),{get: function () {
              return M;
            }, set: function (v) {
              M = v;
            }})}
         else {
          Result = false;
        };
        if (!Result) return Result;
        TZOffset.set((H * 60) + M);
        if (TZ.charAt(0) === "+") TZOffset.set(-TZOffset.get());
      };
      return Result;
    };
    $impl.SPatternCharMismatch = 'Pattern mismatch char "%s" at position %d.';
    $impl.SNoCharMatch = 'Mismatch char "%s" <> "%s" at pattern position %d, string position %d.';
    $impl.SHHMMError = "mm in a sequence hh:mm is interpreted as minutes. No longer versions allowed! (Position : %d).";
    $impl.SNoArrayMatch = "Can't match any allowed value at pattern position %d, string position %d.";
  };
},["RTLConsts"]);
//# sourceMappingURL=dateutils.js.map
