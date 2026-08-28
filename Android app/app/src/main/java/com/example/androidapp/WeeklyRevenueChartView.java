package com.example.androidapp;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.CornerPathEffect;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import androidx.annotation.Nullable;

import com.example.androidapp.models.EarningsDay;

import java.util.ArrayList;
import java.util.List;

public class WeeklyRevenueChartView extends View {

    private final Paint linePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint fillPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint dotPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint dotOuterPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint tooltipPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint tooltipTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint axisLinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);

    private final Path linePath = new Path();
    private final Path fillPath = new Path();

    private List<EarningsDay> data = new ArrayList<>();
    private int selectedIndex = -1;

    public WeeklyRevenueChartView(Context context) {
        super(context);
        init();
    }

    public WeeklyRevenueChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public WeeklyRevenueChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        linePaint.setColor(Color.parseColor("#2E7D32"));
        linePaint.setStrokeWidth(6f);
        linePaint.setStyle(Paint.Style.STROKE);
        linePaint.setStrokeCap(Paint.Cap.ROUND);
        linePaint.setStrokeJoin(Paint.Join.ROUND);
        linePaint.setPathEffect(new CornerPathEffect(20f));

        fillPaint.setStyle(Paint.Style.FILL);

        dotPaint.setColor(Color.parseColor("#2E7D32"));
        dotPaint.setStyle(Paint.Style.FILL);

        dotOuterPaint.setColor(Color.WHITE);
        dotOuterPaint.setStyle(Paint.Style.STROKE);
        dotOuterPaint.setStrokeWidth(4f);

        textPaint.setColor(Color.parseColor("#9CA3AF"));
        textPaint.setTextSize(26f);
        textPaint.setTextAlign(Paint.Align.CENTER);

        tooltipPaint.setColor(Color.parseColor("#1F2937"));
        tooltipPaint.setStyle(Paint.Style.FILL);

        tooltipTextPaint.setColor(Color.WHITE);
        tooltipTextPaint.setTextSize(26f);
        tooltipTextPaint.setTextAlign(Paint.Align.CENTER);
        tooltipTextPaint.setFakeBoldText(true);

        axisLinePaint.setColor(Color.parseColor("#F3F4F6"));
        axisLinePaint.setStrokeWidth(2f);
    }

    public void setData(List<EarningsDay> chartData) {
        if (chartData != null && !chartData.isEmpty()) {
            this.data = new ArrayList<>(chartData);
        } else {
            // Default 7 days if empty
            this.data = new ArrayList<>();
            String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
            for (String d : days) {
                EarningsDay ed = new EarningsDay();
                ed.setName(d);
                ed.setValue(0);
                this.data.add(ed);
            }
        }
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (data.isEmpty()) return super.onTouchEvent(event);

        if (event.getAction() == MotionEvent.ACTION_DOWN || event.getAction() == MotionEvent.ACTION_MOVE) {
            float x = event.getX();
            float padding = 40f;
            float graphWidth = getWidth() - (padding * 2);
            float step = graphWidth / (data.size() - 1);

            int closest = Math.round((x - padding) / step);
            if (closest >= 0 && closest < data.size()) {
                selectedIndex = closest;
                invalidate();
                return true;
            }
        } else if (event.getAction() == MotionEvent.ACTION_UP || event.getAction() == MotionEvent.ACTION_CANCEL) {
            selectedIndex = -1;
            invalidate();
            return true;
        }
        return super.onTouchEvent(event);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if (data == null || data.isEmpty()) return;

        int width = getWidth();
        int height = getHeight();

        float paddingHorizontal = 48f;
        float paddingTop = 40f;
        float paddingBottom = 48f;

        float graphWidth = width - (paddingHorizontal * 2);
        float graphHeight = height - paddingTop - paddingBottom;

        // Find max value
        double maxValue = 0;
        for (EarningsDay ed : data) {
            if (ed.getValue() > maxValue) {
                maxValue = ed.getValue();
            }
        }
        if (maxValue <= 0) maxValue = 5000;

        float stepX = graphWidth / (data.size() - 1);

        linePath.reset();
        fillPath.reset();

        float[] pointsX = new float[data.size()];
        float[] pointsY = new float[data.size()];

        for (int i = 0; i < data.size(); i++) {
            pointsX[i] = paddingHorizontal + (i * stepX);
            float ratio = (float) (data.get(i).getValue() / maxValue);
            pointsY[i] = paddingTop + graphHeight * (1f - ratio);
        }

        // Draw horizontal grid / baseline
        canvas.drawLine(paddingHorizontal, height - paddingBottom, width - paddingHorizontal, height - paddingBottom, axisLinePaint);

        // Build smooth line and fill paths
        linePath.moveTo(pointsX[0], pointsY[0]);
        fillPath.moveTo(pointsX[0], height - paddingBottom);
        fillPath.lineTo(pointsX[0], pointsY[0]);

        for (int i = 1; i < data.size(); i++) {
            float prevX = pointsX[i - 1];
            float prevY = pointsY[i - 1];
            float curX = pointsX[i];
            float curY = pointsY[i];

            float controlX1 = prevX + (curX - prevX) / 2f;
            float controlY1 = prevY;
            float controlX2 = prevX + (curX - prevX) / 2f;
            float controlY2 = curY;

            linePath.cubicTo(controlX1, controlY1, controlX2, controlY2, curX, curY);
            fillPath.cubicTo(controlX1, controlY1, controlX2, controlY2, curX, curY);
        }

        fillPath.lineTo(pointsX[data.size() - 1], height - paddingBottom);
        fillPath.close();

        // Fill with soft green gradient
        fillPaint.setShader(new LinearGradient(
                0, paddingTop,
                0, height - paddingBottom,
                Color.parseColor("#332E7D32"),
                Color.parseColor("#052E7D32"),
                Shader.TileMode.CLAMP
        ));
        canvas.drawPath(fillPath, fillPaint);

        // Draw line
        canvas.drawPath(linePath, linePaint);

        // Draw dots and day labels
        for (int i = 0; i < data.size(); i++) {
            float x = pointsX[i];
            float y = pointsY[i];

            // Outer white ring + inner green circle
            canvas.drawCircle(x, y, 9f, dotPaint);
            canvas.drawCircle(x, y, 9f, dotOuterPaint);

            // Day label
            String dayName = data.get(i).getName();
            if (dayName != null) {
                canvas.drawText(dayName, x, height - 12f, textPaint);
            }
        }

        // Draw interactive tooltip or peak indicator
        int highlightIdx = selectedIndex;
        if (highlightIdx < 0) {
            // Find the highest point to display by default if not touching
            int highestIdx = 0;
            double highestVal = 0;
            for (int i = 0; i < data.size(); i++) {
                if (data.get(i).getValue() > highestVal) {
                    highestVal = data.get(i).getValue();
                    highestIdx = i;
                }
            }
            if (highestVal > 0) {
                highlightIdx = highestIdx;
            }
        }

        if (highlightIdx >= 0 && highlightIdx < data.size()) {
            float hX = pointsX[highlightIdx];
            float hY = pointsY[highlightIdx];

            String tooltipText = "₹" + String.format("%,.0f", data.get(highlightIdx).getValue());
            float textWidth = tooltipTextPaint.measureText(tooltipText);
            float pillWidth = textWidth + 32f;
            float pillHeight = 44f;
            float pillTop = Math.max(10f, hY - pillHeight - 16f);
            float pillLeft = Math.max(10f, Math.min(width - pillWidth - 10f, hX - (pillWidth / 2f)));

            // Tooltip Pill Background
            canvas.drawRoundRect(pillLeft, pillTop, pillLeft + pillWidth, pillTop + pillHeight, 16f, 16f, tooltipPaint);

            // Tooltip Text
            canvas.drawText(tooltipText, pillLeft + (pillWidth / 2f), pillTop + 30f, tooltipTextPaint);

            // Active dot highlight
            canvas.drawCircle(hX, hY, 14f, dotPaint);
            canvas.drawCircle(hX, hY, 14f, dotOuterPaint);
        }
    }
}
