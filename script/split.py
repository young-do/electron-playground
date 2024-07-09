from PIL import Image
import os
import sys

if len(sys.argv) != 2:
    print("Usage: python script.py /path/to/gif/frames")
    sys.exit(1)

# GIF 파일 경로 설정
gif_path = sys.argv[1]
gif_dir = os.path.dirname(os.path.abspath(gif_path))
gif_name = os.path.splitext(os.path.basename(gif_path))[0]
output_dir = os.path.join(gif_dir, 'assets', gif_name)

# 출력 디렉토리가 없으면 생성
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# GIF 파일 열기
with Image.open(gif_path) as img:
    frame = 0
    while True:
        try:
            # 프레임을 22x22로 리사이즈 (만약, 정사각형이 아니라면 세로를 기준으로 리사이즈)
            width, height = img.size
            new_height = 22
            new_width = int((new_height / height) * width)
            img_resized = img.resize((new_width, new_height), Image.LANCZOS)
            # img_resized2x = img.resize((new_width * 2, new_height * 2), Image.LANCZOS)

            # PNG 파일로 저장
            img_resized.save(os.path.join(output_dir, f'frame_{frame:03d}.png'))
            # img_resized2x.save(os.path.join(output_dir, f'frame_{frame:03d}@2x.png'))
            frame += 1
            img.seek(frame)
        except EOFError:
            # 모든 프레임을 다 읽으면 종료
            break

print(f"All frames have been saved in {output_dir}")
