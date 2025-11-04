import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Plane,
  Clock,
  Timer,
  Armchair,
  DollarSign,
  Users,
  Phone,
  Calendar,
  Receipt,
  CreditCard
} from 'lucide-react-native';

export default function ItemHistory({ item }: { item: any }) {
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Receipt size={18} color="#1f2937" strokeWidth={2} />
          <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={styles.paymentContainer}>
          <CreditCard size={16} color="#2563eb" strokeWidth={2} />
          <Text style={styles.payment}>{item.payment_method}</Text>
        </View>
      </View>

      {item.order_details.map((detail: any, index: number) => {
        const f = detail.flight_id;
        return (
          <View key={detail._id || index} style={styles.flightBox}>
            <View style={styles.routeContainer}>
              <Plane size={20} color="#0f172a" strokeWidth={2.5} />
              <Text style={styles.route}>
                {f.departure_airport_code} → {f.arrival_airport_code}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Clock size={16} color="#64748b" strokeWidth={2} />
              <Text style={styles.infoText}>
                {formatDate(f.departure_time)} - {formatDate(f.arrival_time)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Timer size={16} color="#64748b" strokeWidth={2} />
              <Text style={styles.infoText}>{f.duration_minutes} phút</Text>
            </View>

            <View style={styles.infoRow}>
              <Armchair size={16} color="#475569" strokeWidth={2} />
              <Text style={styles.seatText}>
                Ghê: {detail.seat_number.join(', ')}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <DollarSign size={16} color="#0f766e" strokeWidth={2.5} />
              <Text style={styles.priceText}>{detail.price}$</Text>
            </View>
          </View>
        );
      })}

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Users size={18} color="#6b7280" strokeWidth={2} />
          <Text style={styles.detailLabel}>Hành khách:</Text>
          <Text style={styles.detailValue}>
            {item.passenger_details
              .map((p: any) => `${p.passenger_type} x${p.quantity}`)
              .join(', ')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Phone size={18} color="#6b7280" strokeWidth={2} />
          <Text style={styles.detailLabel}>Liên hệ:</Text>
          <Text style={styles.detailValue}>{item.contact_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={18} color="#6b7280" strokeWidth={2} />
          <Text style={styles.detailLabel}>Ngày đặt:</Text>
          <Text style={styles.detailValue}>{formatDate(item.date_created)}</Text>
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Tổng tiền</Text>
        <View style={styles.totalAmountContainer}>
          <DollarSign size={20} color="#16a34a" strokeWidth={2.5} />
          <Text style={styles.totalPrice}>{item.total_price}$</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontWeight: '700',
    fontSize: 17,
    color: '#1f2937',
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  payment: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
  },
  flightBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  route: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  infoText: {
    color: '#64748b',
    fontSize: 14,
  },
  seatText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  priceText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 15,
  },
  detailsSection: {
    marginTop: 6,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 14,
    minWidth: 90,
  },
  detailValue: {
    flex: 1,
    fontWeight: '500',
    color: '#374151',
    fontSize: 14,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    marginTop: 16,
    paddingTop: 14,
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1f2937',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalPrice: {
    fontWeight: '800',
    fontSize: 20,
    color: '#16a34a',
  },
});
