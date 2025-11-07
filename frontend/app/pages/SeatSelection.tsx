import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter, useNavigation } from "expo-router";
import {ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "../services/fetchAPI";

import {addSeat} from "../redux/ordersSlice";
import { TypeNavigationProp } from "../types/types";
import Header from '../components/Header';

type Seat = {
  seat_number: string;   // "1A"
  value: number;         // giá
  class: string;         // first/business/economy...
  status: boolean;       // true = available, false = unavailable
  _id: string;
};

function parseSeat(seatNumber: string) {
  const m = seatNumber.match(/^(\d+)([A-Z])$/i);
  return m ? { row: parseInt(m[1], 10), col: m[2].toUpperCase() } : null;
}

export default function SeatSelection() {
  const router = useRouter();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const navigation = useNavigation<TypeNavigationProp>();

  // Lấy số ghế cần chọn từ Redux (tổng hành khách)
  const orders = useSelector((state: any) => state.orders);
  const totalSelected: number = (Object.values(orders?.passenger_details || {}) as number[])
    .reduce((sum: number, v: number) => sum + (Number(v) || 0), 0);



  // param từ màn trước
  const { flightId,departure,arrival } = route.params || {};

  // state dữ liệu ghế
  const [seat_layout, setSeatLayout] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchApi.get(`flights/${flightId}`);
        if (!mounted) return;
        setSeatLayout(res?.data?.seat_layout || []);
        setLoadErr(null);
      } catch (e: any) {
        setLoadErr("Có lỗi khi tải sơ đồ ghế.");
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [flightId]);

  // Dựng map row/col
  const { rows, cols, seatMap } = useMemo(() => {
    const map: Record<number, Record<string, Seat>> = {};
    const rset = new Set<number>();
    const cset = new Set<string>();
    for (const s of seat_layout) {
      const p = parseSeat(s.seat_number);
      if (!p) continue;
      rset.add(p.row);
      cset.add(p.col);
      (map[p.row] ??= {})[p.col] = s;
    }
    return {
      rows: Array.from(rset).sort((a, b) => a - b),
      cols: Array.from(cset).sort(), // A, B, C, ...
      seatMap: map,
    };
  }, [seat_layout]);

  // Chọn nhiều ghế theo giới hạn
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [warn, setWarn] = useState<string | null>(null);

  const isSelected = (id: string) => selectedSeats.includes(id);

  const toggleSeat = (seat: Seat) => {
    console.log("Toggling seat:", seat.seat_number);
    if (seat.status) return; // ghế khóa
    if (isSelected(seat.seat_number)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat.seat_number));
      setWarn(null);
      return;
    }
    if (selectedSeats.length < totalSelected) {
      setSelectedSeats((prev) => [...prev, seat.seat_number]);
      setWarn(null);
      return;
    }
    setWarn(`Bạn chỉ được chọn tối đa ${totalSelected} ghế.`);
  };

  // Lấy các Seat object đã chọn + tổng tiền
  const selectedSeatObjects: Seat[] = useMemo(() => {
    const out: Seat[] = [];
    for (const id of selectedSeats) {
      const p = parseSeat(id);
      if (p) {
        const s = seatMap[p.row]?.[p.col];
        if (s) out.push(s);
      }
    }
    return out;
  }, [selectedSeats, seatMap]);

  const totalPrice = selectedSeatObjects.reduce((sum, s) => sum + (s.value || 0), 0);

  // Lối đi ở giữa theo tổng số cột
  const aisleAfter = Math.floor(cols.length / 2);

  const renderSeatBox = (row: number, col: string) => {
    const seat: Seat | undefined = seatMap[row]?.[col];
    if (!seat) return <View key={`${row}${col}`} style={[styles.seat, styles.empty]} />;

    const selected = isSelected(seat.seat_number);
    const isUnavailable = seat.status;

    return (
      <TouchableOpacity
        key={seat._id}
        disabled={isUnavailable}
        onPress={() => toggleSeat(seat)}
        style={[
          styles.seat,
          isUnavailable && styles.seatUnavailable,
          selected && styles.seatSelected,
        ]}
      >
        {isUnavailable ? (
          <Text style={styles.seatUnavailableText}>✕</Text>
        ) : selected ? (
          <Text style={styles.seatSelectedText}>✓</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  // Điều kiện bật Next
  const canProceed = totalSelected > 0 && selectedSeats.length === totalSelected;

  // Chuyển Payment (truyền ghế + tổng tiền). Nếu bạn muốn lưu Redux, dispatch tại đây.
  const goNext = () => {
    dispatch(addSeat({ flightId, seats: selectedSeats, seatPrice: totalPrice }));
    navigation.navigate('Seat');
  };

  console.log("Proceeding with seats:", selectedSeats, "Total price:", totalPrice);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={{ marginTop: 10, color: "#6B7280" }}>Đang tải sơ đồ ghế…</Text>
      </SafeAreaView>
    );
  }

  if (loadErr) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#EF4444" }}>{loadErr}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Header text={`${departure} - ${arrival}`} Icon={ChevronLeft} />

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendAvailable]} />
              <Text style={styles.legendText}>Available seat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendUnavailable]}><Text style={styles.legendUnavailableText}>✕</Text></View>
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendSelected]}><Text style={styles.legendSelectedText}>✓</Text></View>
              <Text style={styles.legendText}>Selected</Text>
            </View>
          </View>

          {/* Seat map */}
          <View style={styles.seatMapContainer}>
            {/* header cột */}
            <View style={styles.columnLabels}>
              <Text style={styles.rowLabel}></Text>
              {cols.map((c, idx) => (
                <View key={`h-${c}`} style={styles.columnWrapper}>
                  <Text style={styles.columnLabel}>{c}</Text>
                  {idx === aisleAfter - 1 && <View style={styles.aisle} />}
                </View>
              ))}
            </View>

            {/* từng hàng */}
            {rows.map((r) => (
              <View key={`r-${r}`} style={styles.row}>
                <Text style={styles.rowLabel}>{String(r).padStart(2, "0")}</Text>
                {cols.map((c, idx) => (
                  <View key={`${r}${c}`} style={styles.columnWrapper}>
                    {renderSeatBox(r, c)}
                    {idx === aisleAfter - 1 && <View style={styles.aisle} />}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {warn && <Text style={{ textAlign: "center", color: "#EF4444", marginTop: 6 }}>{warn}</Text>}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTitle}>
              Select seat {selectedSeats.length} of {totalSelected}
            </Text>
            <Text style={styles.footerSubtitle}>
              {selectedSeats.length > 0
                ? `Seats: ${selectedSeats.join(", ")} - $${totalPrice.toFixed(2)}`
                : "No seat selected"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed && { opacity: 0.6 }]}
            disabled={!canProceed}
            onPress={goNext}
          >
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BOX = 40;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  wrapper: { flex: 1, justifyContent: "space-between" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  stepIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center" },
  stepActive: { backgroundColor: "#00BCD4" },
  stepComplete: { backgroundColor: "#00BCD4" },
  stepLine: { width: 28, height: 2, backgroundColor: "#E5E7EB" },
  stepLineActive: { backgroundColor: "#00BCD4" },

  legend: { paddingHorizontal: 20, paddingBottom: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendBox: { width: 24, height: 24, borderRadius: 4, marginRight: 10, alignItems: "center", justifyContent: "center" },
  legendAvailable: { borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  legendUnavailable: { backgroundColor: "#F3F4F6" },
  legendUnavailableText: { fontSize: 12, color: "#9CA3AF" },
  legendSelected: { backgroundColor: "#00BCD4" },
  legendSelectedText: { fontSize: 12, color: "#fff", fontWeight: "700" },
  legendText: { fontSize: 12, color: "#6B7280" },

  seatMapContainer: { alignItems: "center", paddingHorizontal: 10 },
  columnLabels: { flexDirection: "row", alignItems: "center", marginBottom: 10, marginLeft: -10 },
  columnWrapper: { flexDirection: "row", alignItems: "center" },
  columnLabel: { width: BOX, textAlign: "center", fontSize: 14, fontWeight: "600", color: "#6B7280" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rowLabel: { width: BOX, textAlign: "center", fontSize: 14, fontWeight: "600", color: "#6B7280" },

  seat: {
    width: BOX, height: BOX, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB",
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginHorizontal: 2,
  },
  empty: { backgroundColor: "transparent", borderColor: "transparent" },
  seatUnavailable: { backgroundColor: "#F3F4F6", borderColor: "#F3F4F6" },
  seatUnavailableText: { fontSize: 16, color: "#9CA3AF" },
  seatSelected: { backgroundColor: "#00BCD4", borderColor: "#00BCD4" },
  seatSelectedText: { fontSize: 16, color: "#fff", fontWeight: "700" },
  aisle: { width: 20 },

  footer: {
    borderTopWidth: 1, borderTopColor: "#E5E7EB", backgroundColor: "#fff",
    paddingHorizontal: 20, paddingVertical: 15, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
  },
  footerTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  footerSubtitle: { fontSize: 14, color: "#6B7280" },
  nextBtn: { backgroundColor: "#00BCD4", paddingVertical: 12, paddingHorizontal: 50, borderRadius: 8 },
  nextText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
