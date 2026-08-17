import math
import os
import random
import struct
import wave


SAMPLE_RATE = 44_100
DURATION = 30.0
BPM = 112
BEAT = 60 / BPM


def midi(note: int) -> float:
    return 440.0 * (2 ** ((note - 69) / 12))


CHORDS = [
    (50, 57, 61, 64),  # Dmaj7
    (47, 54, 59, 62),  # Bm7
    (43, 50, 55, 59),  # Gmaj7
    (45, 52, 57, 61),  # A7
]


def envelope(position: float, length: float, attack: float, release: float) -> float:
    if position < 0 or position >= length:
        return 0.0
    a = min(1.0, position / max(attack, 0.001))
    r = min(1.0, (length - position) / max(release, 0.001))
    return min(a, r)


def soft_clip(value: float) -> float:
    return math.tanh(value * 1.1) / math.tanh(1.1)


def render() -> list[tuple[float, float]]:
    random.seed(17)
    frames: list[tuple[float, float]] = []
    total = int(DURATION * SAMPLE_RATE)
    chord_length = 4 * BEAT

    for index in range(total):
        t = index / SAMPLE_RATE
        chord_index = int(t / chord_length) % len(CHORDS)
        chord_t = t % chord_length
        notes = CHORDS[chord_index]

        pad_l = 0.0
        pad_r = 0.0
        pad_env = envelope(chord_t, chord_length, 0.55, 0.75)
        for note_index, note in enumerate(notes):
            frequency = midi(note)
            detune = 1.002 if note_index % 2 else 0.998
            phase = 2 * math.pi * frequency * t
            tone = math.sin(phase) + 0.16 * math.sin(phase * 2 + 0.3)
            shimmer = math.sin(2 * math.pi * frequency * detune * t + 0.9)
            pan = (note_index / max(1, len(notes) - 1)) * 2 - 1
            pad_l += (tone + 0.25 * shimmer) * (1 - 0.28 * pan)
            pad_r += (tone + 0.25 * shimmer) * (1 + 0.28 * pan)
        pad_l *= 0.032 * pad_env
        pad_r *= 0.032 * pad_env

        beat_index = int(t / BEAT)
        beat_t = t % BEAT
        root = notes[0] - 12
        bass_phase = 2 * math.pi * midi(root) * t
        bass_env = math.exp(-beat_t * 5.2)
        bass = math.sin(bass_phase) * bass_env * (0.080 if beat_index % 2 == 0 else 0.044)

        half_beat = BEAT / 2
        pluck_t = t % half_beat
        pluck_step = int(t / half_beat)
        pluck_note = notes[(pluck_step + chord_index) % len(notes)] + 12
        pluck_phase = 2 * math.pi * midi(pluck_note) * t
        pluck_env = math.exp(-pluck_t * 11.5)
        pluck = (
            math.sin(pluck_phase)
            + 0.32 * math.sin(pluck_phase * 2)
            + 0.10 * math.sin(pluck_phase * 3)
        ) * pluck_env * 0.065
        pluck_pan = math.sin(pluck_step * 1.7) * 0.34

        kick_t = t % BEAT
        kick_frequency = 72 - 32 * min(kick_t / 0.16, 1)
        kick = math.sin(2 * math.pi * kick_frequency * kick_t) * math.exp(-kick_t * 22) * 0.075

        snare = 0.0
        if beat_index % 4 in (1, 3):
            snare = random.uniform(-1, 1) * math.exp(-beat_t * 22) * 0.034

        hat_t = t % (BEAT / 2)
        hat = random.uniform(-1, 1) * math.exp(-hat_t * 95) * 0.012

        global_fade = min(1.0, t / 1.4, (DURATION - t) / 1.7)
        left = (pad_l + bass + kick + snare * 0.92 + hat * 0.8 + pluck * (1 - pluck_pan)) * global_fade
        right = (pad_r + bass + kick + snare * 1.08 + hat * 1.2 + pluck * (1 + pluck_pan)) * global_fade
        frames.append((soft_clip(left), soft_clip(right)))

    return frames


def typing_event_frames() -> list[int]:
    events: set[int] = set()

    def add_by_speed(start: int, length: int, speed: float) -> None:
        previous = 0
        frame = start
        while previous < length:
            count = min(length, math.floor((frame - start) * speed))
            if count > previous:
                events.add(frame)
            previous = count
            frame += 1

    def add_by_range(start: int, end: int, length: int) -> None:
        previous = 0
        for frame in range(start, end + 1):
            progress = max(0.0, min(1.0, (frame - start) / max(1, end - start)))
            count = min(length, math.floor(progress * length))
            if count > previous:
                events.add(frame)
            previous = count

    add_by_speed(90 + 25, len("Use @Sonoran Software and install the FiveM CAD resource on my server."), 1.25)
    add_by_speed(335 + 23, len("Use @Sonoran Software to create an emergency CAD call whenever someone robs the gas station."), 1.35)
    add_by_range(590 + 34, 590 + 94, len("Use @Sonoran Software to create a CAD call when a player triggers an alarm."))
    add_by_range(590 + 48, 590 + 112, len("Use @Sonoran Software to lower radio signal strength while a player is underwater."))
    add_by_range(590 + 62, 590 + 138, len("Create a Discord bot with @SonoranSoftware that tells unregistered members to join the CMS."))

    # Keep simultaneous card typing crisp without stacking several clicks on one frame.
    return sorted(events)


def render_typing() -> list[tuple[float, float]]:
    total = int(DURATION * SAMPLE_RATE)
    left = [0.0] * total
    right = [0.0] * total
    random.seed(29)

    for event_frame in typing_event_frames():
        start = int((event_frame / 30) * SAMPLE_RATE)
        click_length = int(0.026 * SAMPLE_RATE)
        pitch = random.uniform(820, 1120)
        pan = random.uniform(-0.22, 0.22)
        for offset in range(click_length):
            index = start + offset
            if index >= total:
                break
            position = offset / SAMPLE_RATE
            click_env = math.exp(-position * 125)
            transient = random.uniform(-1, 1) * 0.55
            tone = math.sin(2 * math.pi * pitch * position) * 0.45
            sample = (transient + tone) * click_env * 0.15
            left[index] += sample * (1 - pan)
            right[index] += sample * (1 + pan)

    return [(soft_clip(l), soft_clip(r)) for l, r in zip(left, right)]


def write_wav(path: str, frames: list[tuple[float, float]]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        for left, right in frames:
            output.writeframesraw(
                struct.pack(
                    "<hh",
                    int(max(-1, min(1, left)) * 32767),
                    int(max(-1, min(1, right)) * 32767),
                )
            )


if __name__ == "__main__":
    audio_directory = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    music_destination = os.path.join(audio_directory, "upbeat-bed.wav")
    typing_destination = os.path.join(audio_directory, "typing-synced.wav")
    write_wav(os.path.abspath(music_destination), render())
    write_wav(os.path.abspath(typing_destination), render_typing())
    print(music_destination)
    print(typing_destination)
